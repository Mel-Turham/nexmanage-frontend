import {
  Clock01Icon,
  Location01Icon,
  PauseIcon,
  Search01Icon,
  WorkAlertIcon,
} from 'hugeicons-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';

const fackekList = [1];

const GabaritSList = () => {
  if (fackekList.length === 0) {
    return (
      <div className='flex flex-col gap-4 items-center py-6'>
        <h3 className='text-2xl font-semibold text-gray-500'>
          Aucun gabarit trouvé
        </h3>
        <div className='h-[500px] w-full relative'>
          <Image
            className=' w-full h-full'
            src={'/svg/empty-garberit.svg'}
            alt='Empty gabarit image'
            loading='lazy'
            fill
          />
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full border h-10 rounded-full relative flex items-center px-2'>
        <Search01Icon size={20} className='text-gray-400 ' />
        <input
          placeholder='Recherche par nom'
          className='flex-1 h-8 ml-2 outline-0 placeholder:text-gray-400 text-gray-500 placeholder:text-sm'
        />
      </div>
      {/* list des gabarits */}
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 10 }, (_, index) => (
          <Card className='bg-bleu-ciel p-2' key={index}>
            <CardContent className='p-3.5 bg-white rounded-sm'>
              <CardHeader className='p-0'>
                <CardTitle className='text-blue-400 text-base font-medium'>
                  Nouveau gabarit
                </CardTitle>
              </CardHeader>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  {/* icon */}
                  <Location01Icon size={20} className='text-gray-400' />
                  {/* text */}
                  <span className='text-gray-500 text-sm'>Paris, France</span>
                </div>
                <div className='flex items-center gap-2'>
                  {/* icon */}
                  <Clock01Icon size={20} className='text-gray-400' />
                  {/* text */}
                  <span className='text-gray-500 text-sm'>
                    {' '}
                    10h00 - 12h-00{' '}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {/* icon */}
                  <WorkAlertIcon size={20} className='text-gray-400' />
                  {/* text */}
                  <span className='text-gray-500 text-sm'>
                    Développeur TypeScript
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {/* icon */}
                  <PauseIcon size={20} className='text-gray-400' />
                  {/* text */}
                  <span className='text-gray-500 text-sm'>30 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GabaritSList;
