import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type React from 'react';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}

const CreateModal = ({ open, setOpen, children, className = '' }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className='bg-black/40 backdrop-blur-md' />
      <DialogContent
        className={cn('  w-[1600px] p-0 border-0 shadow-2xl', className)}
      >
        <div className=' rounded-xl  w-full'>
          {/* Decorative background elements */}
          <div className='absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl' />
          <div className='absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 blur-3xl' />
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-r from-amber-400/5 to-pink-400/5 blur-2xl' />

          {/* Content */}
          <div className='z-10 p-6'>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateModal;
