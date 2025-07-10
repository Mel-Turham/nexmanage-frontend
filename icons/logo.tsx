import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NextManageIcon = ({ className }: { className?: string }) => {
  return (
    <Link href={'/'} className={className}>
      <div className='flex items-center gap-2 p-4'>
        <Image
          src='/svg/next-manage-logo.svg'
          width={50}
          height={50}
          alt='logo next-mange'
          loading='lazy'
        />
        <Image
          src='/svg/next-manage-dark.svg'
          width={150}
          height={150}
          alt='logo next-mange'
          loading='lazy'
        />
      </div>
    </Link>
  );
};

export default NextManageIcon;
