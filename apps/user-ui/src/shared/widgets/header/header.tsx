import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <div className='w-full bg-white'>
      <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
        <div>
          <Link href={"/"}>
            <span className='text-2xl font-[500]'>Eshop</span>
          </Link>
        </div>

        <div className='w-[50%] relative'>
          <input type='text' className='w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px]' placeholder='Search for products...'/>
          <div className='w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0'></div>
        </div>
      </div>
    </div>
  )
}
