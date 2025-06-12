import { cn } from '@/lib/utils';
import React from 'react';

interface IndicatorsCarouselProps {
  isActif: boolean;
  onClick: () => void;
}

const IndicatorsCarousel = ({ isActif, onClick }: IndicatorsCarouselProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'h-2 w-10 rounded-full bg-white/25 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 backdrop-blur-xl',
        isActif && 'bg-[#344EA2]'
      )}
    />
  );
};

export default IndicatorsCarousel;
