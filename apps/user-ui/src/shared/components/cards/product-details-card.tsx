"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Ratings from '../ratings';
import { Heart, MapPin, ShoppingCart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductDetailsCard = ({ data, setOpen }: { data: any; setOpen: (open: boolean) => void; }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const router = useRouter();
  
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/20 z-50' onClick={() => setOpen(false)}>
        <div className="relative w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-y-auto max-h-[90vh] min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button positioned to the modal itself instead of the seller info */}
            <button className='absolute z-10 top-4 right-4 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer' onClick={() => setOpen(false)}>
              <X size={20} />
            </button>

            <div className='w-full flex flex-col md:flex-row mt-4'>
                {/* Left Column: Images */}
                <div className='w-full md:w-1/2 h-full'>
                  <Image 
                    src={data?.images?.[activeImage]?.url}
                    alt={data?.title || "Product Image"}
                    height={400}
                    width={400}
                    className='w-full rounded-lg object-contain bg-gray-50'
                  />

                  {/* ThumbNails */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data?.images?.map((img: any, index: number) => (
                      <div 
                      key={index} 
                      className={`cursor-pointer border-2 rounded-md transition-all ${activeImage === index ? "border-blue-500" : "border-transparent"}`}
                      onClick={() => setActiveImage(index)}
                      >
                        <Image src={img?.url} alt={`Thumbnail ${index}`} width={80} height={80} className='rounded-md object-cover w-[80px] h-[80px]'/>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className='w-full md:w-1/2 md:pl-8 mt-6 md:mt-0'>
                    
                    {/* Seller Info */}
                    <div className="border-b pb-4 border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Image src={data?.Shop?.avatar || "/default-avatar.png"} alt='Shop Logo' width={60} height={60} className='rounded-full w-[50px] h-[50px] object-cover'/>
                        <div>
                          <Link href={`/shop/${data?.Shop?.id}`} className='text-lg font-medium hover:text-blue-600 transition'>
                            {data?.Shop?.name}
                          </Link>
                          <span className="block mt-1">
                            <Ratings rating={data?.Shop?.ratings}/>
                          </span>
                          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                            <MapPin size={16}/> 
                            {data?.Shop?.address || "Location not available"}
                          </p>
                        </div>
                      </div>

                      <button 
                      className='flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-md text-sm'
                      onClick={() => router.push(`/inbox?shopId=${data?.Shop?.id}`)}
                      >
                        Chat with seller
                      </button>
                    </div>

                    {/* Product Title & Desc */}
                    <h3 className="text-2xl font-bold text-gray-900 mt-5">
                      {data?.title}
                    </h3>
                    
                    {data?.brand && (
                      <p className="mt-2 text-sm text-gray-500">
                        Brand: <span className="font-semibold text-gray-800">{data.brand}</span>
                      </p>
                    )}

                    <p className="mt-3 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap w-full">
                      {data?.short_description}
                    </p>

                    {/* --- VARIATIONS SECTION --- */}
                    <div className="flex flex-col gap-5 mt-6 border-t border-gray-100 pt-5">
                      
                      {/* Color Row */}
                      {data?.colors?.length > 0 && (
                        <div>
                          <strong className="block text-gray-900 font-semibold mb-2">Color:</strong>
                          <div className="flex flex-wrap gap-3">
                            {data.colors.map((color: string, index: number) => (
                              <button
                              key={index}
                              title={color}
                              className={`w-9 h-9 cursor-pointer rounded-full border-2 transition-transform ${isSelected === color ? "border-gray-900 scale-110 shadow-md ring-2 ring-offset-2 ring-gray-200" : "border-gray-300 hover:scale-105"}`}
                              onClick={() => setIsSelected(color)}
                              style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Size Row */}
                      {data?.sizes?.length > 0 && (
                        <div>
                          <strong className="block text-gray-900 font-semibold mb-2">Size:</strong>
                          <div className="flex flex-wrap gap-2">
                            {data.sizes.map((size: string, index: number) => (
                              <button
                              key={index}
                              className={`px-4 py-2 min-w-[3rem] cursor-pointer rounded-md text-sm font-medium transition ${isSizeSelected === size ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                              onClick={() => setIsSizeSelected(size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price Row */}
                      <div>
                        <strong className="block text-gray-900 font-semibold mb-1">Price:</strong>
                        <div className="flex items-end gap-3">
                          <h3 className="text-3xl font-bold text-gray-900">
                            ${data?.sale_price}
                          </h3>
                          {data?.regular_price > data?.sale_price && (
                            <h3 className="text-lg text-gray-400 line-through mb-1">
                              ${data.regular_price}
                            </h3>
                          )}
                        </div>
                      </div>

                    </div>
                    {/* --- END VARIATIONS SECTION --- */}

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      {/* Quantity Control */}
                      <div className="flex items-center rounded-md border border-gray-300">
                        <button 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-l-md transition cursor-pointer"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                        <button 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-r-md transition cursor-pointer"
                        onClick={() => setQuantity((prev) => prev + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button className={`flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold rounded-lg transition shadow-sm`}>
                        <ShoppingCart size={20}/>
                        Add to Cart
                      </button>

                      {/* Wishlist */}
                      <button className='p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer group'>
                        <Heart className="group-hover:fill-red-500 group-hover:text-red-500 text-gray-400 transition" size={24} />
                      </button>
                    </div>

                    {/* Stock & Delivery Status */}
                    <div className="mt-6 flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm">
                        {data?.stock > 0 ? (
                          <span className="text-green-600 font-semibold flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock ({data.stock} available)
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="text-gray-600 text-sm">
                        Estimated Delivery: <strong className="text-gray-900">{estimatedDelivery.toDateString()}</strong>
                      </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDetailsCard;