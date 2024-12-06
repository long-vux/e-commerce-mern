import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Dashboard,
  PeopleOutline,
  KingBed,
  Payment,
  CalendarMonth,
  Logout
} from '@mui/icons-material'

const Sidebar = () => {
  const activeStyle =
    'bg-[#F5F7F8] border-r-4 border-black duration-500 ease-in-out'
  const inactiveStyle = 'text-gray-700  duration-500 ease-in-out'
  const handleLogout = () => {
    sessionStorage.removeItem('user')
  }

  return (
    <div className='sidebar w-full h-full flex flex-col justify-between'>
      <ul className=' h-full m-4 text-[16px] flex flex-col gap-1'>
        <li>
          <NavLink
            exact
            to='/admin/dashboard'
            className={({ isActive }) =>
              `flex items-center gap-4 p-2 hover:bg-[#F5F7F8]  ${
                isActive ? activeStyle : inactiveStyle
              } `
            }
          >
            <Dashboard />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            exact
            to='/admin/product'
            className={({ isActive }) =>
              `flex items-center hover:bg-[#F5F7F8]  gap-4 p-2 ${
                isActive ? activeStyle : inactiveStyle
              } `
            }
          >
            <PeopleOutline />
            <span>Product</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/admin/order'
            className={({ isActive }) =>
              `hover:bg-[#F5F7F8] flex items-center gap-4 p-2 ${
                isActive ? activeStyle : inactiveStyle
              } `
            }
          >
            <CalendarMonth />
            <span>Order</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/admin/coupon'
            className={({ isActive }) =>
              `hover:bg-[#F5F7F8] flex items-center gap-4 p-2 ${
                isActive ? activeStyle : inactiveStyle
              } `
            }
          >
            <KingBed />
            <span>Coupon</span>
          </NavLink>
        </li>

        <li onClick={handleLogout} className='cursor-pointer'>
          <NavLink
            to='/login'
            className='hover:bg-[#F5F7F8] flex items-center gap-4 p-2'
          >
            <Logout />
            <span>Log out</span>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
