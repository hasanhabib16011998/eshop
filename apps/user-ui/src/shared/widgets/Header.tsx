import Link from 'next/link';
import React from 'react';
import { HeartIcon, Search, ShoppingCart } from 'lucide-react';
import { UserRound } from 'lucide-react';
import HeaderBottom from './HeaderBottom';

function Header() {
  return (
    <div className='w-full bg-white'>
      <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
        
        {/* 1. Logo Section */}
        <div>
          <Link href={"/"}>
            <span className='text-3xl font-[500]'>Eshop</span>
          </Link>
        </div>
        
        {/* 2. Search Box Section */}
        <div className='w-[50%] relative'>
          <input 
            type='text' 
            placeholder='Search for products...' 
            className='w-full px-4 font-poppins font-medium border-2 border-[#3489FF] outline-none h-[55px]'
          />
          <div className='w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0'>
            <Search color='#fff'/>
          </div>
        </div>

        {/* 3. User Profile Section (Moved OUTSIDE the search box div) */}
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-2'>
            <Link href={"/login"} className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#3489FF]'>
              <UserRound />
            </Link>
          </div>
          <Link href={"/login"}>
            <span className='block font-medium'>Hello,</span>
            <span className='font-semibold'>Sign In</span>
          </Link>
        </div>
        <div className='flex items-center gap-5'>
          <Link href={'/wishlist'} className='relative'>
            <HeartIcon/>
            <div className='flex w-6 h-6 border-2 border-white bg-red-500 rounded-full items-center justify-center absolute top-[-10px] right-[-10px]'>
              <span className='text-white font-medium text-sm'>9</span>
            </div>
          </Link>
        </div>
        <div className='flex items-center gap-5'>
          <Link href={'/cart'} className='relative'>
            <ShoppingCart/>
            <div className='flex w-6 h-6 border-2 border-white bg-red-500 rounded-full items-center justify-center absolute top-[-10px] right-[-10px]'>
              <span className='text-white font-medium text-sm'>6</span>
            </div>
          </Link>
        </div>

      </div>

      <div className='border-b border-b-[#99999938]'/>
      <HeaderBottom/>
    </div>
  )
}

export default Header;