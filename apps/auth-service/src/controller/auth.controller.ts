import { Request, Response, NextFunction } from "express"
import { checkOTPRestriction, handleForgotPassword, sendOTP, trackOTPRequests, validateRegistrationData, verifyForgotPasswordOTP, verifyOTP } from "../utils/auth.helper"
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";


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

//Login User
export const loginUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return next(new ValidationError("Email and password are required!"))
        }

        const user = await prisma.users.findUnique({ where: { email }});

        if(!user){
            return next(new AuthError("User does not exist!"))
        }

        //vertify password
        const isMatch = await bcrypt.compare(password, user.password!)
        if(!isMatch) {
            return next(new AuthError("Invalid email or password"))
        }

        //generate access and refresh token
        const accessToken = jwt.sign(
            {id: user.id, role:"user"},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" },
        );
        const refreshToken = jwt.sign(
            {id: user.id, role:"user"},
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" },
        );

        //store the refresh and access token
        setCookie(res,"refresh_token",refreshToken);
        setCookie(res,"access_token",accessToken);

        res.status(200).json({
            message: "Login Successful!",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        return next(error);
    }
}

//user forgot password
export const userForgotPassword = async(req:Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req,res,next,'user');
}

//verify forgot password OTP
export const verifyUserForgotPassword = async(req:Request, res: Response, next: NextFunction) => {
    await verifyForgotPasswordOTP(req,res,next);
}

//reset user password
export const resetUserPassword = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const { email, newPassword } = req.body;
        if(!email || !newPassword) {
            return next(new ValidationError("Email and password are required!"))
        };

        const user = await prisma.users.findUnique({ where: { email }});
        if(!user) return next(new ValidationError("User not found!"));

        //compare new password with existing
        const isSamePassword = await bcrypt.compare(newPassword, user.password!)
        if(isSamePassword) {
            return next(new ValidationError("New password cannot be same as old password"))
        }

        //hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: {email},
            data: { password: hashedPassword },
        });

        res.status(200).json({
            message: "Password reset successfully!"
        })


    } catch (error) {
        next(error);
    }
}

// get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

//refresh token user
export const refreshToken = async( req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) {
            return new ValidationError("Unauthorized! No refresh token.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { id: string; role: string};

        if( !decoded || !decoded.id || !decoded.role) {
            return new JsonWebTokenError('Forbidded! Invalid Refresh Token')
        }

        const user = await prisma.users.findUnique({ where: { id: decoded.id }});
        if(!user) {
            return new AuthError("Forbidden! User/Seller not found.")
        }
        const newAccessToken = jwt.sign(
            {id: decoded.id, role:decoded.role},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" },
        );
        setCookie(res, "access_token", newAccessToken);
        return res.status(201).json({ success: true });
    } catch (error) {
        return next(error);
    }
}


//-----------Seller Registration Start----------------
//register new seller
export const registerSeller = async( req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "seller");
        const { name, email } = req.body;

        const existingSeller = await prisma.sellers.findUnique({
            where: { email },
        });

        if(existingSeller) {
            throw new ValidationError("Seller already exists with this email!")
        }

        await checkOTPRestriction(email, next);
        await trackOTPRequests(email, next);
        await sendOTP( name, email, 'seller-activation');
        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        })

    } catch (error) {
        next(error);
    }
}


//verify seller with OTP
export const verifySeller = async(req:Request, res: Response, next:NextFunction) => {
    try {
        const { email, otp, password, name, phone_number, country } = req.body;
        if( !email || !otp || !password || !name || !phone_number || !country) {
            return next(new ValidationError("All fields are required!"));

        }

        const existingSeller = await prisma.sellers.findUnique({where: {email}});
            
        if(existingSeller){
            return next(new ValidationError("Seller already exists with this email!"));
        }
        await verifyOTP(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.sellers.create({
            data: { name, email, password: hashedPassword , phone_number, country}
        });

        res.status(200).json({
            success: true,
            message: "Seller Registered Successfully!"
        })

    } catch (error) {
        return next(error);

    }
}

//create a new shop
export const createShop = async(req:Request, res: Response, next:NextFunction) => {
    try {
        const { name, bio, address, opening_hours, website, category, sellerId } = req.body;
        if ( !name || !bio || !address || !sellerId || !opening_hours || !category ) {
            return next(new ValidationError("All fields are required!"));
        }

        const shopData:any = { name, bio, address, opening_hours, category, sellerId };

        if(website && website.trim() !== ""){
            shopData.website = website;
        }

        const shop = await prisma.shops.create({
            data: shopData,
        });
        res.status(200).json({
            success: true,
            shop,
        })
    } catch (error) {
        next(error);
    }
}

//create stripe account link

