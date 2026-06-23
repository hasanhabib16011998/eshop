"use client";
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import axios, { AxiosError } from 'axios';
import { countries } from '../../../utils/countries';
import CreateShop from 'apps/seller-ui/src/shared/modules/auth/create-shop';
import StripeLogo from '../../../assets/svgs/stripe';


export default function SignUp() {
    const [activeStep, setActiveStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [showOtp, setShowOtp] = useState(false);
    const [sellerData, setSellerData] = useState<any>(null);
    const [sellerId, setSellerId] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    const startResendTimer = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
    }

    const signUpMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setSellerData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTimer();
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!sellerData) return;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
                {
                    ...sellerData,
                    otp: otp.join(""),
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            setSellerId(data?.seller?.id);
            setActiveStep(2);
        }
    })

    const onSubmit = (data:any) => {
        console.log(data);
        signUpMutation.mutate(data);

    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const resendOTP = () => {
        if (sellerData) {
            signUpMutation.mutate(sellerData);
        }
        console.log('OTP resent to your email')
    }

    const connectStripe = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`,
            { sellerId }
          );
      
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        } catch (error) {
          console.error("Stripe Connection Error:", error);
        }
    };
    return (
        <div className="w-full flex flex-col items-center pt-10 min-h-screen">
            {/* Stepper */}
            <div className="relative flex items-center justify-between md:w-[50%] mb-8">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 -z-10 -translate-y-1/2" />
                {[1, 2, 3].map((step) => (
                    <div key={step}>
                        <div className={`flex w-10 h-10 items-center justify-center rounded-full text-white font-bold ${step <= activeStep ? "bg-blue-700" : "bg-gray-300"}`}>
                            {step}
                        </div>
                        <span className='ml-[-15px]'>
                            {step === 1 ? "Create Account" : step === 2 ? "Setup Shop" : "Connect Bank"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Steps Content */}
            <div className='md:w-[480px] p-8 bg-white-shadow rounded-lg'>
                {/* Register as a seller */}
                {activeStep === 1 && (
                    <>
                        {!showOtp ? (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h3 className='text-2xl font-semibold text-center mb-4'>
                                    Create Account
                                </h3>
                                <label className='block text-gray-700 mb-1'>Name</label>
                                <input
                                    type="text"
                                    placeholder='Enter your name...'
                                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                />
                                {errors.name && (
                                    <p className='text-red-500 text-sm'>
                                        {String(errors.name.message)}
                                    </p>
                                )}


                                <label className='block text-gray-700 mb-1'>Email</label>
                                <input
                                    type="email"
                                    placeholder='support@eshop.com'
                                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className='text-red-500 text-sm'>
                                        {String(errors.email.message)}
                                    </p>
                                )}

                                <label className='block text-gray-700 mb-1'>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder='880196979****'
                                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                    {...register("phone_number", {
                                        required: "Phone Number is required",
                                        pattern: {
                                            value: /^\+?[1-9]\d{1,14}$/,
                                            message: "Invalid Phone Number"
                                        },
                                        minLength: {
                                            value:10,
                                            message: "Phone number must be at least 10 digits"
                                        },
                                        maxLength: {
                                            value:13,
                                            message: "Phone number cannot exceed 15 digits"
                                        }
                                    })}
                                />
                                {errors.phone_number && (
                                    <p className='text-red-500 text-sm'>
                                        {String(errors.phone_number.message)}
                                    </p>
                                )}

                                <label className='block text-gray-700 mb-1'>Country</label>
                                <select 
                                className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                {...register("country", {
                                    required: "Country is required",
                                })}
                                >
                                    <option value="">Select Your Country</option>
                                    {countries.map((country)=>(
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && (
                                    <p className='text-red-500 text-sm'>
                                        {String(errors.country.message)}
                                    </p>
                                )}


                                <label className='block text-gray-700 mb-1'>Password</label>
                                <div className='relative'>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder='Min. 6 characters'
                                        className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className='absolute inset-y-0 right-3 flex-items-center text-gray-400'
                                    >
                                        {passwordVisible ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className='text-red-500 text-sm'>
                                        {String(errors.password.message)}
                                    </p>
                                )}


                                <button
                                    type="submit"
                                    disabled={signUpMutation.isPending}
                                    className="w-full mt-6 bg-[#3489ff] text-white p-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
                                >
                                    {signUpMutation.isPending ? "Signing up..." : "Sign Up"}
                                </button>

                                {signUpMutation.isError && signUpMutation.error instanceof AxiosError && (
                                    <p className='text-red-500 text-sm mt-2'>
                                        {signUpMutation.error.response?.data?.message || signUpMutation.error.message}
                                    </p>
                                )}

                                <p className='text-center text-gray-500 mb-4 mt-2'>
                                    Already have an account? {" "}
                                    <Link href={"/login"} className='text-blue-500'>Login</Link>
                                </p>
                            </form>
                        ) : (
                            <div>
                                <h3 className='text-xl font-semibold text-center mb-4'>
                                    Enter OTP
                                </h3>
                                <div className="flex justify-center gap-6">
                                    {otp?.map((digit, index) => (
                                        <input key={index} type="text" ref={(el) => {
                                            if (el) inputRefs.current[index] = el;
                                        }}
                                            maxLength={1}
                                            className='w-12 h-12 text-center border border-gray-300 outline-none !rounded-xl'
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={verifyOtpMutation.isPending}
                                    onClick={() => verifyOtpMutation.mutate()}
                                    className="w-full mt-6 bg-[#3489ff] text-white p-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
                                >
                                    {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                                </button>
                                <p className='text-center text-sm mt-4'>
                                    {canResend ? (
                                        <button onClick={resendOTP} className='text-blue-500 cursor-pointer'>Resend OTP</button>
                                    ) : (
                                        `Resend OTP in ${timer}s`
                                    )}
                                </p>
                                {
                                    verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                                        <p className='text-red-500 text-sm mt-2'>
                                            {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                                        </p>
                                    )
                                }

                            </div>
                        )}
                    </>
                )}

                {/* Create Shop */}
                {activeStep === 2 && (
                    <CreateShop sellerId={sellerId} setActiveStep={setActiveStep}/>
                )}

                {/* Connect Stripe */}
                {activeStep === 3 && (
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold">Withdraw Method</h3>
                        <br/>
                        <button 
                        className="w-full m-auto flex items-center justify-center gap-3 text-lg bg-[#435975] text-white py-2 rounded-lg"
                        onClick={connectStripe}
                        >
                            Connect Stripe<StripeLogo/>
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}
