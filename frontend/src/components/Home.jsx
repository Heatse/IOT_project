import React, { useState } from 'react'
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { AiFillPieChart } from 'react-icons/ai'
import { AiOutlineDatabase } from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';



function Home() {

  const [open, setOpen] = useState(true)
  const location = useLocation


  const Menus = [
    { title: 'Dashboard', path: '/dashboard', src: <RxDashboard /> },
    { title: 'Datasensor', path: '/datasensor', src: <AiOutlineDatabase /> },
    { title: 'History', path: '/history', src: <AiFillPieChart /> },
    { title: 'Profile', path: '/profile', src: <CgProfile /> },
  ]

  return (
    <>
      <div
        className={`
      bg-purple-500 
      h-screen p-5 pt-8
      sm:block relative 
      ${open ? "w-60" : "w-20"} 
      duration-300
      relative`}>
        <BsFillArrowLeftCircleFill
          className={`
        bg-white
        text-purple-500 
          text-3xl 
          rounded-full 
          absolute 
          -right-3 
          top-9 
          border
          cursor-pointer
          ${open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        {/* <Link to={"/dashboard"} className='inline-flex'>
          <RxDashboard className='text-4xl rounded cursor-pointer block float-left mr-2' />
          <h1 Link className={`text-2xl text-white origin-left font-medium ${!open && "scale-0"}`} >DashBoard </h1>
        </Link>
        <div className='inline-flex'>
          <CgProfile className='text-4xl rounded cursor-pointer block float-left mr-2' />
          <h1 className={`text-2xl text-white origin-left font-medium ${!open && "scale-0"}`} >Profile </h1>
        </div>
        <div className='inline-flex'>
          <RxDashboard className='text-4xl rounded cursor-pointer block float-left mr-2' />
          <h1 className={`text-2xl text-white origin-left font-medium ${!open && "scale-0"}`} >DashBoard </h1>
        </div> */}

        <ul className='pt-6'>
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index}>
              <li
                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${menu.gap ? 'mt-9' : 'mt-2'} ${location.pathname === menu.path &&
                  'bg-gray-200 dark:bg-gray-700'
                  }`}
              >
                <span className='text-2xl'>{menu.src}</span>
                <span
                  className={`${!open && 'hidden'
                    } origin-left duration-300 hover:block`}
                >
                  {menu.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
