import AuthRight from '@/components/customs/auth-right';
import { cn } from '@/lib/utils';
import React from 'react';

const AuthLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className='w-full flex px-3 lg:px-0 overflow-hidden'>
      <div
        className={cn(
          'relative w-full  md:w-1/2 bg-gradient-to-bl h-screen lg:flex lg:flex-col xl:w-2/3 xl:max-w-screen-2xl  lg:pb-4',
          className
        )}
      >
        {children}

        <div className='absolute -top-14 -right-14 w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-xl' />
        <div className='absolute -bottom-14 -left-14 w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-xl' />
      </div>
      <AuthRight />
    </div>
  );
};

export default AuthLayout;
