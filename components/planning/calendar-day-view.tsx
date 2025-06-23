"use client";

// src/components/planning/CalendarDayView.tsx
import type React from "react";
import { daysOfWeek, months } from "./types";
import { useRouter } from "next/navigation";

interface CalendarDayViewProps {
  currentDate: Date;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ currentDate }) => {
  const router = useRouter();

  const handleHourClick = (hour: number) => {
    // Format the date as ISO string for the URL
    console.log(hour);

    const dateParam = currentDate.toISOString().split("T")[0];
    router.push(`/admin/planning/create?date=${dateParam}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {daysOfWeek[(currentDate.getDay() + 6) % 7]} {currentDate.getDate()}{" "}
          {months[currentDate.getMonth()]}
        </h3>
      </div>
      <div className="p-6 min-h-[400px]">
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="flex border-b border-gray-100 py-2"
              onClick={() => handleHourClick(hour)}
            >
              <div className="w-16 text-sm text-gray-500">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 min-h-[40px] hover:bg-gray-50 cursor-pointer transition-colors duration-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
