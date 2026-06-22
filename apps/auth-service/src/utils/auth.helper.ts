import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { Request, Response, NextFunction } from "express";
import prisma from "@packages/libs/prisma";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ ;

export const validateRegistrationData = (data:any, userType: "user" | "seller") => {
    const {name, email, password, phone_number, country } = data;
    if(!name || !email || !password || (userType === "seller" && (!phone_number || !country))){
        return new ValidationError(`Missing required fields!`);
    }
    if(!emailRegex.test(email)) {
        return new ValidationError("Invalid email format!")
    }

    return null;
}

export const checkOTPRestriction = async(email:string, next:NextFunction) => {
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account locked due to multiple failed attempts! Try again in 30 minutes."));
    }

    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting again."));
    }

    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Please wait 1 minute before requesting a new OTP."));
    }
}

export const trackOTPRequests = async(email:string, next:NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');
    if(otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`,"locked", "EX", 3600);
        return next(new ValidationError("Too many OTP requests. Please wait 1 hour before requesting again."))
    }

    await redis.set(otpRequestKey, otpRequests+1, 'EX', 3600);
}

export const sendOTP = async(name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000,9999).toString();

    //send email
    await sendEmail(email, "Verify your Email", template, {name, otp});

    //set otp to Redis with email
    await redis.set(`otp:${email}`, otp, "EX", 300); //expires in 5 minutes
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
}

//verify otp
export const verifyOTP = async(email:string, otp:string, next: NextFunction) => {
    const storedOTP = await redis.get(`otp:${email}`);
    if(!storedOTP){
        throw new ValidationError("Invalid or expired OTP!");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

    if(storedOTP !== otp){
        if(failedAttempts >= 2){
            await redis.set(`otp_lock:${email}`, "locked", 'EX', 1800); //Lock for 30 minutes
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError("Too many failed attempts. Your account is locked for 30 minutes!");
        }

        await redis.set(failedAttemptsKey, failedAttempts+1);
        throw new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left.`);
    }

    await redis.del(`otp:${email}`, failedAttemptsKey)
};

export const handleForgotPassword = async(req:Request, res: Response, next: NextFunction, userType: "user" | "seller") => {
    try {
        const { email } = req.body;
        if(!email){
            throw new ValidationError("Email is required!")
        }

        //find user/seller in DB
        const user = userType === 'user' ? (
            await prisma.users.findUnique({ where: {email}})
        ) : (
            await prisma.sellers.findUnique({ where: {email}})
        )

        if(!user) throw new ValidationError(`${userType} not found!`);

        //check otp restrictions
        await checkOTPRestriction(email, next);
        await trackOTPRequests(email, next);

        //generate otp and send mail
        await sendOTP(user.name, email, userType === 'user'? "forgot-password-user-mail": "forgot-password-seller-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        })
        
    } catch (error) {
        next(error);
    }
}

export const verifyForgotPasswordOTP = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        if( !email || !otp ) throw new ValidationError("Email and OTP are required!");

        await verifyOTP(email, otp, next);
        res.status(200).json({
            message: "OTP verified. You can now reset your password."
        })
    } catch (error) {
        
    }
}