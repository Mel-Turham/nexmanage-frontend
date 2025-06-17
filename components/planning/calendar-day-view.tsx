// src/components/planning/CalendarDayView.tsx
import React from "react";
import { daysOfWeek, months } from "./types";

interface CalendarDayViewProps {
  currentDate: Date;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ currentDate }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">
          {daysOfWeek[(currentDate.getDay() + 6) % 7]}{" "}
          {currentDate.getDate()} {months[currentDate.getMonth()]}
        </h3>
      </div>
      <div className="p-6 min-h-[400px]">
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="flex border-b border-gray-100 py-2"
            >
              <div className="w-16 text-sm text-gray-500">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 min-h-[40px] hover:bg-gray-50 cursor-pointer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;