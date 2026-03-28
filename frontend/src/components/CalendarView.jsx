import React from 'react';
import useAppStore from '../store/useAppStore';
import { format, parseISO, subDays } from 'date-fns';

export default function CalendarView() {
  const { entries, setView, setSelectedDate } = useAppStore();
  
  const days = {};
  entries.forEach(e => {
    if (!days[e.date]) {
      days[e.date] = { total: 0, goals: {} };
    }
    days[e.date].total += e.duration;
    if (e.goalId) {
      const gName = e.goalId.name;
      days[e.date].goals[gName] = (days[e.date].goals[gName] || 0) + e.duration;
    }
  });

  const last14Days = Array.from({length: 14}).map((_, i) => {
    return format(subDays(new Date(), i), 'yyyy-MM-dd');
  }).reverse();

  return (
    <>
      <header className="mb-12">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">HISTORY</p>
        <h2 className="text-[3.5rem] font-light tracking-[-0.04em] text-on-surface leading-tight">Calendar</h2>
      </header>
      
      <section className="space-y-4">
        {last14Days.map(date => {
          const stats = days[date];
          const hasEntries = !!stats;
          
          let topGoal = null;
          if (hasEntries) {
            const sortedGoals = Object.entries(stats.goals).sort((a,b) => b[1] - a[1]);
            if (sortedGoals.length > 0) topGoal = sortedGoals[0][0];
          }

          return (
            <div 
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setView('daily');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-colors duration-0 active:bg-surface-dim ${hasEntries ? 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container' : 'bg-transparent border-dashed border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-[1.25rem] tracking-tight">{format(parseISO(date), 'MMM d, EEE')}</p>
                {hasEntries && (
                  <p className="font-regular text-[1rem] text-on-surface">
                    {stats.total >= 60 ? `${(stats.total / 60).toFixed(1)}h` : `${stats.total}m`}
                  </p>
                )}
              </div>
              {hasEntries && topGoal && (
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-on-surface-variant mt-2">
                  Top: <span className="text-on-surface">{topGoal}</span>
                </p>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
