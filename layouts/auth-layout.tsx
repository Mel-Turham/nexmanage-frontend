import AuthRight from '@/components/customs/auth-right';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const AuthLayout = ({
  children,
  className,
  url,
  text,
  textLink,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
  text?: string;
  textLink?: string;
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
        <div className='px-6 flex justify-between mt-6 flex-wrap  z-20 relative'>
          <p className='text-muted-foreground text-xs mt-2 font-medium'>
            {text}
            {url && textLink && (
              <Link href={`${url}`} className='text-[#142938] ml-2 underline'>
                {textLink}
              </Link>
            )}
          </p>
          <p className='text-muted-foreground text-xs mt-2 font-medium'>
            <Link href={'/terms'} className='underline'>
              Conditions générales
            </Link>
          </p>
        </div>
      </div>
      <AuthRight />
    </div>
  );
};

export default AuthLayout;
