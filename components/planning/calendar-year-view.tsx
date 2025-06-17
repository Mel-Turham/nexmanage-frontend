// src/components/planning/CalendarYearView.tsx
import React from "react";
import { daysOfWeekShort, months } from "./types";

interface CalendarYearViewProps {
  currentDate: Date;
}

const CalendarYearView: React.FC<CalendarYearViewProps> = ({ currentDate }) => {
  const generateYearMonths = () => {
    const year = currentDate.getFullYear();
    return months.map((month, index) => ({
      name: month,
      date: new Date(year, index, 1),
    }));
  };

  const yearMonths = generateYearMonths();

  return (
    <div className="grid grid-cols-3 gap-6">
      {yearMonths.map((month, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <h3 className="text-center font-semibold mb-4">{month.name}</h3>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {daysOfWeekShort.map((day) => (
              <div key={day} className="text-center text-gray-500 p-1">
                {day.slice(0, 1)}
              </div>
            ))}
            {(() => {
              const monthStart = new Date(
                currentDate.getFullYear(),
                index,
                1
              );
              const monthDays = new Date(
                currentDate.getFullYear(),
                index + 1,
                0
              ).getDate();
              const startDay = (monthStart.getDay() + 6) % 7;
              const days = [];

              // Jours vides au début
              for (let i = 0; i < startDay; i++) {
                days.push(<div key={`empty-${i}`} className="p-1"></div>);
              }

              // Jours du mois
              for (let day = 1; day <= monthDays; day++) {
                const isToday =
                  new Date().getFullYear() ===
                    currentDate.getFullYear() &&
                  new Date().getMonth() === index &&
                  new Date().getDate() === day;
                days.push(
                  <div
                    key={day}
                    className={`text-center p-1 hover:bg-gray-100 cursor-pointer rounded ${
                      isToday ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    {day}
                  </div>
                );
              }
              return days;
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarYearView;