'use client';

import { Search01Icon } from 'hugeicons-react';
import React from 'react';
import { NavUser } from './nav-user';
import Notifications from './notifications';

const Header = () => {
  return (
    <header className="flex h-[10vh] shrink-0 flex-row items-center justify-between gap-2 px-4">
      <div className="border-gray hidden w-[40%] flex-row items-center rounded-md border px-2 transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-md lg:flex">
        <Search01Icon color="#e5e5e5" size={24} />
        <input
          type="search"
          name="search"
          placeholder="Recherche un employer, un contrat..."
          className="w-full px-4 py-3 text-sm outline-none"
        />
      </div>
      <div className="ml-auto flex flex-row items-center gap-4 lg:gap-2">
        <Notifications />
        <NavUser />
      </div>
    </header>
  );
};

export default Header;
