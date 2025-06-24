import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Paperclip, Send, User2, User2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MoreHorizontalCircle01Icon } from 'hugeicons-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

const Commantaires = () => {
  return (
    <div>
      {/* Content area */}
      <ScrollArea className='p-4 space-y-4 min-h-[300px]'>
        {/* First message with image */}
        <div className='flex items-start space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-gray-200'>
              <User2Icon className='h-4 w-4' />
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='bg-gray-100 rounded-lg p-2 max-w-xs'>
              <Image
                src='https://plus.unsplash.com/premium_vector-1682299692411-5bd547d070c1?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='Construction building'
                width={200}
                height={150}
                className='rounded-md object-cover w-full'
              />
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className='flex justify-end'>
          <div className='flex items-center space-x-2'>
            <span className='text-xs text-gray-500'>Vu</span>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm rounded-full'>
              Ça c&apos;est fait
            </Button>
            <Avatar className='h-6 w-6'>
              <AvatarFallback className='bg-gray-200 text-xs'>
                <User2Icon className='h-3 w-3' />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Second message indicator */}
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-gray-200'>
              <User2 className='h-4 w-4' />
            </AvatarFallback>
          </Avatar>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreHorizontalCircle01Icon className='h-5 w-5' />
          </Button>
        </div>
      </ScrollArea>
      {/* Input area */}
      <div className='border-t p-4'>
        <div className='flex items-center space-x-2'>
          <div className='flex-1 relative'>
            <Input placeholder='Envoyer un commantaire' className='pr-10' />
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8'
            >
              <Paperclip className='h-4 w-4' />
            </Button>
          </div>
          <Button
            size='icon'
            className='bg-blue-600 hover:bg-blue-700 h-11 w-11'
          >
            <Send className='h-8 w-8' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Commantaires;
