import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { getOverview } from '../api';
import { format, parseISO } from 'date-fns';

export default function GoalOverview() {
  const { goals } = useAppStore();
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverview().then(data => {
      setOverview(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <>
      <header className="mb-12">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">FOCUS</p>
        <h2 className="text-[3.5rem] font-light tracking-[-0.04em] text-on-surface leading-tight">Goals</h2>
      </header>
      
      {loading ? (
        <p className="text-on-surface-variant text-[1rem]">Loading your progress...</p>
      ) : (
        <section className="space-y-6">
          {goals.length === 0 && <p className="text-on-surface-variant text-center py-8">No goals created yet.</p>}
          
          {goals.map(goal => {
            const stat = overview.find(o => o.goal._id === goal._id);
            const totalMins = stat ? stat.totalTime : 0;
            const recent = stat ? stat.recentEntries : [];

            return (
              <div key={goal._id} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[1.5rem] font-medium tracking-tight text-on-surface mb-1">{goal.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }}></span>
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-on-surface-variant">Active</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-on-surface-variant mb-1">Invested</p>
                    <p className="text-[1.5rem] font-medium text-on-surface">
                      {totalMins >= 60 ? `${(totalMins / 60).toFixed(1)}h` : `${totalMins}m`}
                    </p>
                  </div>
                </div>

                {recent.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-outline-variant/20">
                    <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.08em] mb-3">Recent Activity</p>
                    <div className="space-y-3">
                      {recent.map(r => (
                        <div key={r._id} className="flex justify-between items-start">
                          <span className="text-[1rem] font-medium tracking-tight text-on-surface truncate w-3/5">{r.title}</span>
                          <div className="flex gap-4 text-on-surface-variant text-[0.875rem]">
                            <span>{r.duration >= 60 ? `${(r.duration / 60).toFixed(1)}h` : `${r.duration}m`}</span>
                            <span className="w-12 text-right">{format(parseISO(r.date), 'MMM d')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 pt-4 border-t border-outline-variant/20 text-sm text-on-surface-variant">No activity logged yet.</p>
                )}
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}
