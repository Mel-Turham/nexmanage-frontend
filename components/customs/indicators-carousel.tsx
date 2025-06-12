import { cn } from "@/lib/utils";
import React from "react";

interface IndicatorsCarouselProps {
  isActif: boolean;
  onClick: () => void;
}

const IndicatorsCarousel = ({ isActif, onClick }: IndicatorsCarouselProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-2 w-10 rounded-full bg-white/25 cursor-pointer hover:bg-[#344EA2] transition-all duration-300 ease-in-out  backdrop-blur-xl",
        isActif && "bg-[#344EA2]"
      )}
    />
  );
};

export default IndicatorsCarousel;
