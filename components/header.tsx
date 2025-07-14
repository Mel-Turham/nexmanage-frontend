'use client';

import { Search01Icon } from 'hugeicons-react';
import React from 'react';
import { NavUser } from './nav-user';
import Notifications from './notifications';

const Header = () => {
  return (
    <header className='flex flex-row justify-between h-[10vh] shrink-0 items-center gap-2 px-4'>
      <div className='flex flex-row items-center px-2 rounded-md border border-gray w-[40%] focus-within:shadow-md focus-within:border-blue-500 transition-all duration-200'>
        <Search01Icon color='#e5e5e5' size={24} />
        <input
          type='search'
          name='search'
          placeholder='Recherche un employer, un contrat,...'
          className='py-3 px-4 w-full outline-none text-sm'
        />
      </div>
      <div className='flex flex-row items-center gap-2'>
        <Notifications />
        <NavUser />
      </div>
    </header>
  );
};

export default Header;
