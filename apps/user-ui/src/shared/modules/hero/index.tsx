import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image'; // Uncomment when you add your model/lifestyle images

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col space-y-6 text-center lg:text-left">
          {/* Small announcement badge */}
          <div className="inline-flex items-center justify-center lg:justify-start space-x-2">
            <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              New Arrivals
            </span>
            <span className="text-sm font-medium text-gray-500">
              Summer Collection '26 is live
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Elevate your everyday <span className="text-rose-500 italic font-serif">style.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Discover mindfully crafted clothing designed for the modern woman. Shop our latest curation of effortless silhouettes and premium fabrics.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop the Collection
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-300 font-semibold rounded-full flex items-center justify-center transition-colors">
              Explore Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          
          {/* Trust Indicators / Perks */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 opacity-80 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free Shipping over $75
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Easy 30-Day Returns
            </div>
          </div>
        </div>

        {/* Right Column: Fashion Image Container */}
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center group bg-stone-100">
          
          <Image 
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Minimalist clothing rack with soft rose and neutral garments" 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            unoptimized
          /> 
          
          {/* Subtle overlay to ensure the aesthetic feels premium and slightly soft */}
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/10 via-transparent to-stone-100/10 mix-blend-overlay"></div>
        </div>

      </div>
    </section>
  );
}