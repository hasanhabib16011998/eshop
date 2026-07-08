"use client";
import Link from 'next/link';
import React from 'react';
import { HeartIcon, Search, ShoppingCart } from 'lucide-react';
import { UserRound } from 'lucide-react';
import HeaderBottom from './HeaderBottom';
import Logo from '../../assets/images/Logo';
import useUser from '../../hooks/useUser';
import { useStore } from '../../store';

function Header() {
const { user, isLoading } = useUser();
const wishlist = useStore((state: any) => state.wishlist);
const cart = useStore((state: any) => state.cart);

  return (
    <div className='w-full bg-white'>
      <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
        
        {/* 1. Logo Section */}
        <div>
          <Link href={"/"} className='flex items-center gap-2'>
            <Logo width={40} height={40}/>
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
          {!isLoading && user ? (
            <Link href={"/profile"} className='flex items-center gap-3'>
              {/* Avatar Circle */}
              <div className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#3489FF]'>
                <UserRound />
              </div>
              {/* Text Block */}
              <div>
                <span className='block text-sm font-medium text-gray-500'>Hello,</span>
                <span className='block font-semibold'>{ user?.name?.split(" ")[0] }</span>
              </div>
            </Link>
          ) : (
            <Link href={"/login"} className='flex items-center gap-3'>
              {/* Avatar Circle (Logged out) */}
              <div className='border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-gray-300'>
                <UserRound className="text-gray-500" />
              </div>
              {/* Text Block */}
              <div>
                <span className='block text-sm font-medium text-gray-500'>Hello,</span>
                <span className='block font-semibold'>{ isLoading? "...":"Sign In" }</span>
              </div>
            </Link>
          )}
        </div>



        <div className='flex items-center gap-5'>
          <Link href={'/wishlist'} className='relative'>
            <HeartIcon/>
            <div className='flex w-6 h-6 border-2 border-white bg-red-500 rounded-full items-center justify-center absolute top-[-10px] right-[-10px]'>
              <span className='text-white font-medium text-sm'>{wishlist?.length}</span>
            </div>
          </Link>
        </div>
        <div className='flex items-center gap-5'>
          <Link href={'/cart'} className='relative'>
            <ShoppingCart/>
            <div className='flex w-6 h-6 border-2 border-white bg-red-500 rounded-full items-center justify-center absolute top-[-10px] right-[-10px]'>
              <span className='text-white font-medium text-sm'>{cart?.length}</span>
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