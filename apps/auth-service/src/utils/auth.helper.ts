import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ ;

export const validateRegistrationData = (data:any, userType: "user" | "seller") => {
    const {name, email, password, phone_number, country } = data;
    if(!name || !email || !password || (userType === "seller" && (!phone_number || !country))){
        return new ValidationError(`Missing required fields!`);
    }
    if(!emailRegex.test(email)) {
        return new ValidationError("Invalid email format!")
    }
}

export const checkOTPRestriction = (email:string, next:NewableFunction) => {

}

export const sendOTP = async(name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000,9999).toString();

    //set otp to Redis with email
    
}