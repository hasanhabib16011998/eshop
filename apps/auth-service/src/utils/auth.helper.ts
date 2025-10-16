import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";

const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

export const validateRegistrationData = (data:any,userType:"user"|"seller") => {
    const { name, email, password, phone_number, country } = data;

    if(!name || !email || !password || ( userType === 'seller' && ( !phone_number || !country ))){
        throw new ValidationError(`Missing required fields!`);
    }

    if(!emailRegex.test(email)){
        throw new ValidationError(`Invalid email format`);
    }

}

export const checkOTPRestrictions = async(email:string,next:NextFunction) => {
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account locked due to multiple failed attempts! Try again in 30 minutes"));
    }

    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again."));
    }

    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Please wait 1 minute before requesting a new OTP!"))
    }
}

export const trackOTPRestrictions = async(email:string,next:NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt(await redis.get(otpRequestKey) || "0");

    if(otpRequests >= 2){
        await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600); //lock for one hour
        return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting again"))
    }

    await redis.set( otpRequestKey, otpRequests+1, "EX", 3600 );
}

export const sendOTP = async (name:string,email:string,template:string) => {
    const otp = crypto.randomInt(1000,9999).toString();
    await sendEmail(email,"Verify Your Email",template, {name,otp});
    await redis.set(`otp:${email}`,otp,'EX',300);
    await redis.set(`otp_cooldown:${email}`,'true','EX',60);
}