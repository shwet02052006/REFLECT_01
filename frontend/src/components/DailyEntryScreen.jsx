import React from 'react';
import useAppStore from '../store/useAppStore';
import QuickAddForm from './QuickAddForm';
import { format, parseISO } from 'date-fns';

export default function DailyEntryScreen() {
  const { entries, selectedDate } = useAppStore();
  
  const parsedDate = parseISO(selectedDate);
  const dayName = format(parsedDate, 'EEEE');
  const monthDay = format(parsedDate, 'MMMM d');

  const totalMinutes = entries.reduce((acc, e) => acc + e.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinsRem = totalMinutes % 60;

  // Group by goal
  const goalTotals = {};
  entries.forEach(e => {
    if (!e.goalId) return;
    const gName = e.goalId.name;
    if (!goalTotals[gName]) goalTotals[gName] = { mins: 0, color: e.goalId.color || '#4f6263' };
    goalTotals[gName].mins += e.duration;
  });

  return (
    <>
      <header className="mb-12">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">{dayName}</p>
        <h2 className="text-[3.5rem] font-light tracking-[-0.04em] text-on-surface leading-tight">{monthDay}</h2>
      </header>

      <section className="mb-16">
        <QuickAddForm />
      </section>

      <section className="space-y-11">
        {entries.length === 0 ? (
          <p className="text-on-surface-variant text-center py-4">No entries yet. Add one above.</p>
        ) : (
          entries.map(entry => {
            const dateObj = new Date(entry.createdAt);
            const timeStr = format(dateObj, 'hh:mm a');
            
            return (
              <div key={entry._id} className="group relative">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-on-surface-variant mb-2">{timeStr}</p>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[1.5rem] font-medium tracking-tight text-on-surface mb-2">{entry.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-md text-[0.6875rem] font-semibold uppercase tracking-[0.04em]">
                        {entry.goalId?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right mt-1">
                    <p className="text-[1rem] font-regular text-on-surface">
                      {entry.duration >= 60 ? `${Math.floor(entry.duration / 60)}h ${entry.duration % 60}m` : `${entry.duration}m`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="mt-20 border-t border-outline-variant/10 pt-10">
        <div className="bg-surface-container rounded-xl p-8">
          <div className="flex justify-between items-baseline mb-8">
            <h4 className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-on-surface-variant">Daily Total</h4>
            <p className="text-[1.5rem] font-medium text-on-surface">{totalHours > 0 ? `${totalHours}h ` : ''}{totalMinsRem}m</p>
          </div>
          <div className="space-y-4">
            {Object.entries(goalTotals)
              .sort((a,b) => b[1].mins - a[1].mins)
              .map(([name, data]) => {
                const percentage = totalMinutes > 0 ? Math.round((data.mins / totalMinutes) * 100) : 0;
                return (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-wider w-[120px] truncate">{name}</span>
                    <div className="flex-1 mx-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-[0.6875rem] font-bold text-on-surface w-[60px] text-right">
                      {data.mins >= 60 ? `${Math.floor(data.mins / 60)}h ${data.mins % 60}m` : `${data.mins}m`}
                    </span>
                  </div>
              )})}
          </div>
        </div>
      </section>
    </>
  );
}
