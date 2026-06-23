"use client"
import React, { useEffect } from 'react'
import useSidebar from '../../hooks/useSidebar';
import { usePathname } from 'next/navigation';
import useSeller from '../../hooks/useSeller';
import Box from './box';
import { Sidebar } from './sidebar.styles';
import Link from 'next/link';
import Logo from '../../assets/svgs/eshop-logo.svg';
import Image from 'next/image';

const SidebarBarWrapper = () => {
  const {activeSidebar,setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller} = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName,setActiveSidebar])

  const getIconColor = (route:string) => activeSidebar === route ? "#0085ff" : "#969696"

  return (
    <Box css={{
      height: "100vh",
      zIndex: 202,
      position: "sticky",
      padding: "8px",
      top: '0',
      overFlowY: "scroll",
      scrollbarWidth: "none"
    }}
    className="sidebar-wrapper"
    >
    <Sidebar.Header>
      <Box>
        <Link href={'/'} className='flex justify-center text-center gap-2'>
        <Image src={Logo} alt="Eshop Logo" width={40} height={40} />
        <Box>
          <h3 className='text-xl font-medium text-[#ecedee]'>{seller?.shop?.name}</h3>
        </Box>
        </Link>
      </Box>
    </Sidebar.Header>
    </Box>
  )
}

export default SidebarBarWrapper