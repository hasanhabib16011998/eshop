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
import SidebarItem from './sidebar.item';
import SidebarMenu from './sidebar.menu';
import { ListOrdered, LayoutDashboard, CreditCard, ShoppingBasket, PackagePlus, CalendarPlus, Calendar, Mail, Settings, BellRing, TicketPercent, LogOut} from 'lucide-react';


const SidebarBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar])

  const getIconColor = (route: string) => activeSidebar === route ? "#4c55ac" : "#969696"

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
              <h5 className='text-xl font-medium text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]'>{seller?.shop?.address}</h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <Sidebar.Body className='body sidebar'>
        <SidebarItem
          title="Dashboard"
          icon={<LayoutDashboard size={24} color={getIconColor("/dashboard")} />}
          isActive={activeSidebar === '/dashboard'}
          href="/dashboard"
        />
        <SidebarMenu title="Main Menu">
          <SidebarItem
            title="Orders"
            icon={<ListOrdered size={24} color={getIconColor("/dashboard/accounts")} />}
            isActive={activeSidebar === '/dashboard/orders'}
            href="/dashboard/orders"
          />
          <SidebarItem
            title="Payments"
            icon={<CreditCard size={24} color={getIconColor("/dashboard/payments")} />}
            isActive={activeSidebar === '/payments'}
            href="/dashboard/payments"
          />
        </SidebarMenu>
        <SidebarMenu title="Products">
          <SidebarItem
            title="Create Product"
            icon={<PackagePlus size={24} color={getIconColor("/dashboard/create-product")} />}
            isActive={activeSidebar === '/dashboard/create-product'}
            href="/dashboard/create-product"
          />
          <SidebarItem
            title="All Products"
            icon={<ShoppingBasket size={24} color={getIconColor("/dashboard/all-products")} />}
            isActive={activeSidebar === '/dashboard/all-products'}
            href="/dashboard/all-products"
          />
        </SidebarMenu>
        <SidebarMenu title="Events">
          <SidebarItem
            title="Create Event"
            icon={<CalendarPlus size={24} color={getIconColor("/dashboard/create-event")} />}
            isActive={activeSidebar === '/dashboard/create-event'}
            href="/dashboard/create-event"
          />
          <SidebarItem
            title="All Events"
            icon={<Calendar size={24} color={getIconColor("/dashboard/all-events")} />}
            isActive={activeSidebar === '/dashboard/all-events'}
            href="/dashboard/all-events"
          />
        </SidebarMenu>
        <SidebarMenu title="Controllers">
          <SidebarItem
            title="Inbox"
            icon={<Mail size={24} color={getIconColor("/dashboard/inbox")} />}
            isActive={activeSidebar === '/dashboard/inbox'}
            href="/dashboard/inbox"
          />
          <SidebarItem
            title="Settings"
            icon={<Settings size={24} color={getIconColor("/dashboard/settings")} />}
            isActive={activeSidebar === '/dashboard/settings'}
            href="/dashboard/settings"
          />
          <SidebarItem
            title="Notifications"
            icon={<BellRing size={24} color={getIconColor("/dashboard/notfications")} />}
            isActive={activeSidebar === '/dashboard/notfications'}
            href="/dashboard/notfications"
          />
        </SidebarMenu>
        <SidebarMenu title="Extras">
          <SidebarItem
            title="Discount Codes"
            icon={<TicketPercent size={24} color={getIconColor("/dashboard/discount-codes")} />}
            isActive={activeSidebar === '/dashboard/discount-codes'}
            href="/dashboard/discount-codes"
          />
          <SidebarItem
            title="Logout"
            icon={<LogOut size={24} color={getIconColor("/logout")} />}
            isActive={activeSidebar === '/logout'}
            href="/logout"
          />
          
        </SidebarMenu>
      </Sidebar.Body>
    </Box>
  )
}

export default SidebarBarWrapper