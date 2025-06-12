import AuthRight from '@/components/customs/auth-right';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full flex px-3 lg:px-0 overflow-hidden'>
      <div className='relative w-full  md:w-1/2 bg-gradient-to-bl h-screen'>
        {children}

        <div className='absolute -top-14 -right-14 w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-xl' />
        <div className='absolute -bottom-14 -left-14 w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-xl' />
      </div>
      <AuthRight />
    </div>
  );
};

export default AuthLayout;
