import { Request, Response, NextFunction } from "express"
import { checkOTPRestriction, sendOTP, trackOTPRequests, validateRegistrationData, verifyOTP } from "../utils/auth.helper"
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";


//Register new user
export const userRegistration = async(req:Request, res: Response, next:NextFunction) => {

    /* #swagger.tags = ['Auth']
      #swagger.description = 'Endpoint to register a new user.'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'User registration data',
            required: true,
            schema: {
                name: "John Doe",
                email: "john@example.com"
            }
      }
    */

    try {
        validateRegistrationData(req.body, "user");
        const {name, email} = req.body;

        const existingUser = await prisma.users.findUnique({
            where: {email}
        })

        if (existingUser){
            return next(new ValidationError("User already exists with this email"))
        };

        await checkOTPRestriction(email,next);
        await trackOTPRequests(email,next);
        await sendOTP(name, email, "user-activation-mail")

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        })

    } catch(error) {
        return next(error);

    }
    
}

//verify user with OTP
export const verifyUser = async(req:Request, res: Response, next:NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;
        if( !email || !otp || !password || !name ) {
            return next(new ValidationError("All fields are required!"));

        }

        const existingUser = await prisma.users.findUnique({where: {email}});
            
        if(existingUser){
            return next(new ValidationError("User already exists with this email!"));
        }
        await verifyOTP(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: { name, email, password: hashedPassword }
        });

        res.status(200).json({
            success: true,
            message: "User Registered Successfully!"
        })

    } catch (error) {
        return next(error);

    }
}