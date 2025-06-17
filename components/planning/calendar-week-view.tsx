// src/components/planning/CalendarWeekView.tsx
import React from "react";
import { daysOfWeekShort } from "./types";

interface CalendarWeekViewProps {
  currentDate: Date;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({ currentDate }) => {
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = (currentDate.getDay() + 6) % 7;
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
        <div className="p-4"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="p-4 text-center border-r border-gray-200 last:border-r-0"
          >
            <div className="text-sm font-medium text-gray-700">
              {daysOfWeekShort[index]}
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${
                day.toDateString() === new Date().toDateString()
                  ? "text-blue-600"
                  : ""
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8">
        <div className="border-r border-gray-200">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-200 p-2 text-xs text-gray-500"
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {weekDays.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="border-r border-gray-200 last:border-r-0"
          >
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeekView;