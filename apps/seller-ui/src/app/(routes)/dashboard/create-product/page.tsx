"use client"
import ImagePlaceHolder from 'apps/seller-ui/src/shared/components/image-placeholder';
import { ChevronRight } from 'lucide-react'
import Input from 'packages/components/input';
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ColorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-specifications';
import CustomProperties from 'packages/components/custom-properties';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import RichTextEditor from 'packages/components/rich-text-editor';
import SizeSelector from 'packages/components/size-selector';
import { error } from 'node:console';
import { resolve } from 'node:path';


export default function CreateProduct() {
    const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm();
    const [openImageModal, setOpenImageModal] = useState(false);
    const [isChanged, setIsChanged] = useState(true);
    const [images, setImages] = useState<(File | null)[]>([null]);
    const [loading, setLoading] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("product/api/get-categories");
                console.log(res.data);
                return res.data;

            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });


    const { data: discountCodes = [], isLoading: isDiscountLoading } = useQuery({
        queryKey: ["shop-discounts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/product/api/get-discount-codes");
            return res?.data?.discount_codes || [];
        }
    });

    const categories = data?.categories || [];
    const subCategoriesData = data?.subCategories || [];
    const selectedCategory = watch("category");
    const regularPrice = watch("regular_price");
    const subcategories = useMemo(() => {
        if (!selectedCategory) return [];
        if (Array.isArray(subCategoriesData)) {
            return subCategoriesData.filter((sub: any) =>
                sub.categoryId === selectedCategory || sub.category === selectedCategory
            );
        }
        return subCategoriesData[selectedCategory] || [];
    }, [selectedCategory, subCategoriesData]);



    const onSubmit = (data: any) => {
        console.log(data);
    };

    const convertFiletoBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })

    }

    const handleImageChange = async(file: File | null, index: number) => {
        if (!file) return;
        try {
            const fileName = await convertFiletoBase64(file);
            
            const response = await axiosInstance.post("/product/api/upload-product-image", {fileName});
            console.log(response.data);

            const updatedImages = [...images];
            updatedImages[index] = response.data.file_url;

            if(index === images.length -1 && updatedImages.length<8) {
                updatedImages.push(null);
            }
            setImages(updatedImages);
            setValue("images", updatedImages)
        } catch (error) {
            console.log(error);
        }

    };

    const handleRemoveImage = (index: number) => {
        try {
            const updatedImages = [...images];

            const imageToDelete = updatedImages[index];

            if(imageToDelete && typeof imageToDelete === "string") {
                // delete the picture
            }

            updatedImages.splice(index, 1);

            //add null placeholder
            if(!updatedImages.includes(null) && updatedImages.length < 8){
                updatedImages.push(null);
            };
            setImages(updatedImages);
            setValue("images", updatedImages);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSaveDraft = () => {
        console.log("Draft Saved");
    }
    return (
        <form
            className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Heading & Breadcrumbs */}
            <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
                Create Product
            </h2>
            <div className="flex items-center">
                <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
                <ChevronRight size={20} className="opacity-[.8]" />
                <span>Create Product</span>
            </div>

            {/* Content Layout */}
            <div className="py-4 w-full flex gap-6">
                <div className="md:w-[35%]">
                    {images?.length > 0 && (
                        <ImagePlaceHolder setOpenImageModal={setOpenImageModal} size="765 x 850" small={false} index={0} onImageChange={handleImageChange} onRemove={handleRemoveImage} />
                    )}

                    <div className='grid grid-cols-2 gap-3 mt-4'>
                        {images.slice(1).map((_, index) => (
                            <ImagePlaceHolder setOpenImageModal={setOpenImageModal} size="765 x 850" small={true} key={index} index={index + 1} onImageChange={handleImageChange} onRemove={handleRemoveImage} />
                        ))}
                    </div>
                </div>


                {/* Right side form input */}
                <div className="md:w-[65%]">
                    <div className="w-full flex gap-6">
                        {/* Product Title Input */}
                        <div className="w-2/4">
                            <Input
                                label="Product Title *"
                                placeholder='Enter Product Title'
                                {...register(
                                    "title",
                                    {
                                        required: "Title is required"
                                    }
                                )}
                            />
                            {errors.title && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {errors.title.message as string}
                                </p>
                            )}

                            <div className="mt-2">
                                <Input
                                    type="textarea"
                                    rows={7}
                                    cols={10}
                                    label="Short Description * (Max 150 words)"
                                    placeholder="Enter product description for quick view"
                                    {...register("description", {
                                        required: "Description is required",
                                        validate: (value) => {
                                            const wordCount = value.trim().split(/\s+/).length;
                                            return (
                                                wordCount <= 150 ||
                                                `Description cannot exceed 150 words (Current: ${wordCount})`
                                            );
                                        },
                                    })}
                                />
                                {errors.description && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.description.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Tags *"
                                    placeholder='apple, flagship...'
                                    {...register("tags", { required: "Title is required" })}
                                />
                                {errors.tags && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.tags.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Warrenty *"
                                    placeholder='1 Year / No Warrenty'
                                    {...register("warrenty", { required: "Warrenty is required" })}
                                />
                                {errors.warrenty && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.warrenty.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Slug *"
                                    placeholder='product_slug'
                                    {...register("slug", {
                                        required: "Slug is required",
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-a-z0-9]+)*$/,
                                            message: "Invalid slug format! use only lowercase letters, numbers and spaces"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Slug must be at least 3 characters long."
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: "Slug cannot be longer than 50 characters."
                                        },

                                    })}
                                />
                                {errors.slug && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.slug.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Brand *"
                                    placeholder='Apple'
                                    {...register("brand", { required: "Brand is required" })}
                                />
                                {errors.brand && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.brand.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <ColorSelector control={control} errors={errors} />
                            </div>

                            <div className="mt-2">
                                <CustomSpecifications control={control} errors={errors} />
                            </div>

                            <div className="mt-2">
                                <CustomProperties control={control} errors={errors} />
                            </div>

                            <div className="mt-2">
                                <label className='block font-semibold text-gray-300 mb-1'>
                                    Cash On Delivery*
                                </label>
                                <select
                                    {...register("cash_on_delivery", {
                                        required: "Cash on Delivery is required",
                                    })}
                                    defaultValue="yes"
                                    className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md"
                                >
                                    <option value="yes" className="bg-black">
                                        Yes
                                    </option>
                                    <option value="no" className="bg-black">
                                        No
                                    </option>
                                </select>
                                {errors.cash_on_delivery && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.cash_on_delivery.message as string}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="w-2/4">
                            <label className='block font-semibold text-gray-300 mb-1'>
                                Category*
                            </label>
                            {isLoading ? (
                                <p className="text-gray-400">Loading Categories</p>
                            ) : isError ? (
                                <p className='text-red-500'>Failed to load categories</p>
                            ) : (
                                <Controller
                                    name='category'
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full p-2 border outline-none border-gray-700 bg-transparent"
                                        >
                                            <option value="" className='bg-black'>Select Category</option>
                                            {categories?.map((category: any) => {
                                                const val = typeof category === 'object' ? category.id : category;
                                                const label = typeof category === 'object' ? category.name : category;
                                                return (
                                                    <option value={val} key={val} className='bg-black'>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    )}
                                />
                            )}
                            {errors.category && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {errors.category.message as string}
                                </p>
                            )}

                            {/* Sub Category */}
                            <div className="mt-2">
                                <label className='block font-semibold text-gray-300 mb-1'>
                                    Sub Category*
                                </label>
                                {isLoading ? (
                                    <p className="text-gray-400">Loading subcategories</p>
                                ) : isError ? (
                                    <p className='text-red-500'>Failed to load subcategories</p>
                                ) : (
                                    <Controller
                                        name='subcategory'
                                        control={control}
                                        rules={{ required: "Subcategory is required" }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full p-2 border outline-none border-gray-700 bg-transparent"
                                            >
                                                <option value="" className='bg-black'>Select Subcategory</option>
                                                {subcategories?.map((subcategory: any) => {
                                                    const val = typeof subcategory === 'object' ? subcategory.id : subcategory;
                                                    const label = typeof subcategory === 'object' ? subcategory.name : subcategory;
                                                    return (
                                                        <option value={val} key={val} className='bg-black'>
                                                            {label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    />
                                )}

                            </div>

                            <div className="mt-2">
                                <label className="block font-semibold text-gray-300 mb-1">
                                    Detailed Description * (Min 100 words)
                                </label>
                                <Controller
                                    name="detailed_description"
                                    control={control}
                                    rules={{
                                        required: "Detailed description is required!",
                                        validate: (value) => {
                                            const wordCount = value
                                                ?.split(/\s+/)
                                                .filter((word: string) => word).length;
                                            return (
                                                wordCount >= 100 ||
                                                "Description must be at least 100 words!"
                                            );
                                        },
                                    }}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />

                                {errors.detailed_description && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.detailed_description.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Video URL"
                                    placeholder='https://www.youtube.com/embed/xyz123'
                                    {...register("video_url", {
                                        pattern: {
                                            value: /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                                            message: "Invalid youtube embed url! use format like: https://www.youtube.com/embed/xyz123"
                                        }
                                    })}
                                />
                                {errors.video_url && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.video_url.message as string}
                                    </p>
                                )}

                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Regular Price"
                                    placeholder='20$'
                                    {...register("regular_price", {
                                        valueAsNumber: true,
                                        min: { value: 1, message: "price must be at least 1." },
                                        validate: (value) =>
                                            !isNaN(value) || "Only numbers are allowed",
                                    })}
                                />
                                {errors.regular_price && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.regular_price.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Selling Price"
                                    placeholder='20$'
                                    {...register("sale_price", {
                                        valueAsNumber: true,
                                        min: { value: 1, message: "sale price must be at least 1." },
                                        validate: (value) =>
                                            !isNaN(value) || "Only numbers are allowed",
                                    })}
                                />
                                {errors.sale_price && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.sale_price.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <Input
                                    label="Stock *"
                                    placeholder='100'
                                    {...register("stock", {
                                        valueAsNumber: true,
                                        min: { value: 1, message: "stock must be at least 1." },
                                        validate: (value) => {
                                            if (isNaN(value)) return "Only numbers are allowed!";
                                            if (!Number.isInteger(value)) return "Stock must be a whole number!";
                                            return true;
                                        }
                                    })}
                                />
                                {errors.stock && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {errors.stock.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="mt-2">
                                <SizeSelector control={control} errors={errors} />
                            </div>

                            <div className="mt-3">
                                <label className='block font-semibold text-gray-300 mb-1'>
                                    Select Discount Codes (Optional)
                                </label>

                                {isDiscountLoading ? (
                                    <p className="text-gray-400">
                                        Loading discount codes...
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {discountCodes?.map((code: any) => (
                                            <button
                                                key={code.id}
                                                className={`px-3 py-1 rounded-md text-sm font-semibold border ${watch("discountCodes")?.includes(code.id) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"}`}
                                                onClick={() => {
                                                    const currentSelection = watch("discountCodes") || [];
                                                    const updatedSelection = currentSelection?.includes(code.id)
                                                        ? currentSelection.filter((id: string) => id !== code.id)
                                                        : [...currentSelection, code.id];
                                                    setValue("discountCodes", updatedSelection);
                                                }}
                                            >
                                                {code?.public_name} ({code.discountValue} {code.discountType === "percentage" ? "%" : "$"})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                {isChanged && (
                    <button
                        type="button"
                        className='px-4 py-2  bg-gray-700 text-white rounded-md'
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                )}
                <button
                    type="submit"
                    className='px-4 py-2  bg-blue-600 text-white rounded-md'
                    disabled={loading}
                    onClick={handleSaveDraft}
                >
                    {loading ? "Creating..." : "Create"}
                </button>
            </div>


        </form>
    )
}
