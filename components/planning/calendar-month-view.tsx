// src/components/planning/CalendarMonthView.tsx
import React from "react";
import { daysOfWeek } from "./types";

interface CalendarMonthViewProps {
  currentDate: Date;
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
}) => {
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = (firstDay.getDay() + 6) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const calendarDays = generateMonthDays();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`
                  min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                  ${isToday ? "bg-blue-50" : ""}
                  hover:bg-gray-50 cursor-pointer
                `}
            >
              <div
                className={`text-sm font-medium mb-2 ${
                  isToday ? "text-blue-600" : ""
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {day.getDate() === 15 && isCurrentMonth && (
                  <div className="border-l-4 border-Primaire text-Primaire bg-bleu-ciel">
                    <h1 className="pl-1 text-sm font-semibold">Employer nom</h1>
                    <span className="pl-1 text-xs">08h 00 - 09h 00</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;
