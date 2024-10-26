'use client';

import { useState } from 'react';
import { FcImport, FcPortraitMode, FcReadingEbook } from "react-icons/fc";
import useSession from '@/app/hooks/useSession';

import useDashboardStore from '../_zustand/dashboard.zustand';

const SideBar = () => {
  const { session } = useSession();
  const menu = useDashboardStore(state => state.menu);
  const setMenu = useDashboardStore(state => state.setMenu);

  const role = session?.user?.role;

  const TEACHER_ITEMS = [
    { title: 'Courses', menu: 'courses', icon: <FcReadingEbook /> },
    { title: 'Enrollments', menu: 'enrollments', icon: <FcImport /> },
    { title: 'Students', menu: 'students', icon: <FcPortraitMode /> },
  ];

  const STUDENT_ITEMS = [
    { title: 'Courses', menu: 'courses', icon: <FcReadingEbook /> },
  ];

  const items = role === 'TEACHER' ? TEACHER_ITEMS : STUDENT_ITEMS;

  return (
    <aside className="w-full bg-purple-300 text-white h-full flex flex-col justify-between">

      <div className='flex flex-col p-4'>
        <h1 className='text-lg font-bold'>{`Welcome, ${session?.user?.username}`}</h1>
      </div>
      
      <ul className="flex-1 flex flex-col p-4 gap-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`px-4 py-3 cursor-pointer flex items-center gap-2 rounded-md justify-start hover:scale-105 transition-all duration-300 ${menu === item.menu ? 'bg-purple-700' : 'bg-purple-500 hover:bg-purple-700'}`}
            onClick={() => {
              setMenu(item.menu);
            }}
          >
            {item.icon}
            <span className='text-base w-full'>{item.title}</span>
          </li>
        ))}
      </ul>

      <div className='flex flex-col p-4'>
        <button className='bg-purple-500 hover:bg-purple-700 transition-all duration-300 px-4 py-3 rounded-md'>Settings</button>
      </div>
    </aside>
  );
};

export default SideBar;
