import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { shopCategories } from 'apps/seller-ui/src/app/utils/categories';

const CreateShop = ({
    sellerId,
    setActiveStep
}: {
    sellerId: string,
    setActiveStep: (step: number) => void
}) => {

    const { register, handleSubmit, formState: { errors } } = useForm<any>();
    const createShopMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
                data,
            )
            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3);
        }
    });

    const onSubmit = async (data: any) => {
        const shopData = { ...data, sellerId };
        createShopMutation.mutate(shopData);
    };

    const countWords = (text: string) => text.trim().split(/\s+/).length;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-2xl font-semibold text-center mb-4'>
                    Set up new shop
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

                <label className='block text-gray-700 mb-1'>Bio (Max 100 Words)</label>
                <input
                    type="text"
                    placeholder='Enter shop bio...'
                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                    {...register("bio", {
                        required: "Shop bio is required",
                        validate: (value: string) =>
                            countWords(value) <= 100 || "Bio cant exceed 100 words",
                    })}
                />
                {errors.bio && (
                    <p className='text-red-500 text-sm'>
                        {String(errors.bio.message)}
                    </p>
                )}

                <label className='block text-gray-700 mb-1'>Address</label>
                <input
                    type="text"
                    placeholder='Enter shop address...'
                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                    {...register("address", {
                        required: "Shop address is required",
                    })}
                />
                {errors.address && (
                    <p className='text-red-500 text-sm'>
                        {String(errors.address.message)}
                    </p>
                )}

                <label className='block text-gray-700 mb-1'>Opening Hours</label>
                <input
                    type="text"
                    placeholder='e.g., Sun-Fri 9AM - 6PM'
                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                    {...register("openning_hours", {
                        required: "Shop opening hours is required",
                    })}
                />
                {errors.openning_hours && (
                    <p className='text-red-500 text-sm'>
                        {String(errors.openning_hours.message)}
                    </p>
                )}

                <label className='block text-gray-700 mb-1'>Website</label>
                <input
                    type="url"
                    placeholder='https://example.com'
                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                    {...register("website", {
                        pattern: {
                            // Removed the /g flag and wrapped in value/message object
                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                            message: 'Enter a valid URL',
                        }
                    })}
                />
                {errors.website && (
                    <p className='text-red-500 text-sm'>
                        {String(errors.website.message)}
                    </p>
                )}

                <label className="block text-gray-700 mb-1">Category *</label>
                <select
                    className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
                    {...register("category", { required: "Category is required" })}
                >
                    <option value="">Select a category</option>
                    {shopCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="text-red-500 text-sm">
                        {String(errors.category.message)}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full mt-6 bg-[#3489ff] text-white p-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
                >
                    Create Shop
                </button>

            </form>
        </div>
    )
}

export default CreateShop