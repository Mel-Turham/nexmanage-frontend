'use client';

import React, { useState, useEffect } from 'react';
import { format, isSameDay, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';

interface CustomCalendarProps {
  startDate?: Date;
  endDate?: Date;
  onChange?: (dates: Date[]) => void;
}

export default function CustomCalendar({ startDate, endDate, onChange }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startDate || new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      const range = eachDayOfInterval({ start: startDate, end: endDate });
      setSelectedDates(range);
    }
  }, [startDate, endDate]);

  const handleDayClick = (day: Date) => {
    const exists = selectedDates.some(d => isSameDay(d, day));
    const newDates = exists
      ? selectedDates.filter(d => !isSameDay(d, day))
      : [...selectedDates, day];

    setSelectedDates(newDates);
    onChange?.(newDates);
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay() || 7;
    const days: JSX.Element[] = [];

    for (let i = 1; i < startDay; i++) days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const selected = selectedDates.some(d => isSameDay(d, date));

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(date)}
          className={`w-8 h-8 flex items-center justify-center text-xs rounded-full ${
            selected ? 'bg-sky-200 font-semibold text-slate-900' : 'text-slate-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  return (
    <div className="border border-slate-300 rounded-xl p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth}><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </span>
        <button onClick={goToNextMonth}><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-600 mb-2">
        {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(day => (
          <div key={day} className="w-8 h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {renderCalendarDays()}
      </div>
    </div>
  );
}