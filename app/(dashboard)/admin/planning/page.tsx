'use client';

import React, { useState } from 'react';
import PlanningHeader from '@/components/planning/planning-header';
import CalendarDayView from '@/components/planning/calendar-day-view';
import CalendarWeekView from '@/components/planning/calendar-week-view';
import CalendarMonthView from '@/components/planning/calendar-month-view';
import CalendarYearView from '@/components/planning/calendar-year-view';
import { ViewType, months } from '@/components/planning/types';
import RightBar from '@/components/right-bar';

const KanbanComponent = () => {
  return (
    <div className='p-8 bg-white rounded-lg shadow-md h-[87vh] overflow-auto'>
      {/* Ton contenu Kanban ici */}
      <h2 className='text-xl font-semibold mb-4'>Kanban Board</h2>
      <p>Contenu du Kanban...</p>
    </div>
  );
};

const PlanningPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // Juin 2025
  const [viewType, setViewType] = useState<ViewType>('Mois');
  const [isKanbanActive, setIsKanbanActive] = useState(false);

  // Navigation selon le type de vue
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    switch (viewType) {
      case 'Jour':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'Semaine':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Mois':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'Année':
        newDate.setFullYear(
          newDate.getFullYear() + (direction === 'next' ? 1 : -1)
        );
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Générer le titre selon la vue
  const getViewTitle = () => {
    const year = currentDate.getFullYear();
    const month = months[currentDate.getMonth()];

    switch (viewType) {
      case 'Jour':
        return `${currentDate.getDate()} ${month} ${year}`;
      case 'Semaine':
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = (currentDate.getDay() + 6) % 7;
        startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${
            months[startOfWeek.getMonth()]
          } ${year}`;
        } else {
          return `${startOfWeek.getDate()} ${
            months[startOfWeek.getMonth()]
          } - ${endOfWeek.getDate()} ${months[endOfWeek.getMonth()]} ${year}`;
        }
      case 'Mois':
        return `${month} ${year}`;
      case 'Année':
        return `${year}`;
      default:
        return `${month} ${year}`;
    }
  };

  // Rendu selon le type de vue ou Kanban
  const renderMainContent = () => {
    if (isKanbanActive) {
      return <KanbanComponent />;
    }
    switch (viewType) {
      case 'Jour':
        return <CalendarDayView currentDate={currentDate} />;
      case 'Semaine':
        return <CalendarWeekView currentDate={currentDate} />;
      case 'Année':
        return <CalendarYearView currentDate={currentDate} />;
      default: // Mois
        return <CalendarMonthView currentDate={currentDate} />;
    }
  };

  return (
    <div className='contents'>
      <div className='bg-bleu-ciel p-[3vh] pb-0 h-full w-full rounded-t-4xl'>
        <div className='bg-white rounded-t-2xl h-[87vh] overflow-y-auto'>
          <div className='flex flex-col px-4 py-4 gap-4'>
            {!isKanbanActive && (
              <PlanningHeader
                viewType={viewType}
                setViewType={setViewType}
                goToToday={goToToday}
                navigate={navigate}
                viewTitle={getViewTitle()}
              />
            )}
            <main>{renderMainContent()}</main>
          </div>
        </div>
      </div>
      <RightBar
        onToggleKanban={() => setIsKanbanActive((v) => !v)}
        isKanbanActive={isKanbanActive}
      />
    </div>
  );
};

export default PlanningPage;
