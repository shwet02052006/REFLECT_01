import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';

export default function QuickAddForm() {
  const { goals, addEntry, addGoal, selectedDate } = useAppStore();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [goalId, setGoalId] = useState('');
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');

  const parseTime = (val) => {
    if (!val) return 0;
    const str = String(val).toLowerCase().trim();
    
    if (str.includes(':')) {
      const [h, m] = str.split(':');
      return (parseInt(h) || 0) * 60 + (parseInt(m) || 0);
    }
    
    let totalMins = 0;
    const hMatch = str.match(/(\d+(?:\.\d+)?)\s*h/);
    const mMatch = str.match(/(\d+(?:\.\d+)?)\s*m/);
    
    if (hMatch) totalMins += parseFloat(hMatch[1]) * 60;
    if (mMatch) totalMins += parseFloat(mMatch[1]);
    
    if (totalMins > 0) return Math.round(totalMins);
    
    const num = parseFloat(str);
    if (!isNaN(num)) return Math.round(num);
    
    return 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !duration) return;

    const parsedDuration = parseTime(duration);
    if (parsedDuration <= 0) {
      alert("Please enter a valid time (e.g., '1:30', '45m', '2h')");
      return;
    }

    let finalGoalId = goalId;
    
    // Quick add new goal if none exists or creating on the fly
    if (!finalGoalId && goals.length === 0 && !isCreatingGoal) {
      alert("Please create a goal first");
      return;
    }

    if (isCreatingGoal && newGoalName) {
      const g = await addGoal({ name: newGoalName });
      finalGoalId = g._id;
      setIsCreatingGoal(false);
      setNewGoalName('');
    }

    if (!finalGoalId) {
      alert("Please select a goal");
      return;
    }

    await addEntry({
      title,
      duration: parsedDuration,
      goalId: finalGoalId,
      date: selectedDate
    });

    setTitle('');
    setDuration('');
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6 transition-colors duration-0 hover:bg-surface-container">
      <form onSubmit={handleAdd} className="flex flex-col space-y-4">
        <input 
          type="text"
          placeholder="What action did you take today towards your goal?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-transparent border-none focus:ring-0 p-0 text-[1.125rem] sm:text-[1.5rem] font-medium tracking-tight text-on-surface placeholder:text-outline-variant outline-none" 
        />
        
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4 flex-wrap gap-4">
          <div className="flex items-center space-x-3 max-w-[60%]">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
            <input 
              type="text"
              placeholder="e.g. 1h 30m, 45m"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="bg-transparent border-none focus:ring-0 p-0 text-[1rem] w-32 text-on-surface-variant placeholder:text-outline-variant outline-none" 
            />
            
            {isCreatingGoal ? (
              <input 
                type="text" 
                placeholder="New Goal Name" 
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="bg-transparent border-none focus:ring-0 p-0 text-[1rem] flex-1 text-on-surface-variant outline-none placeholder:text-outline-variant border-b border-outline-variant/50 w-full"
                required
              />
            ) : (
              <select 
                value={goalId} 
                onChange={(e) => {
                  if (e.target.value === 'new') setIsCreatingGoal(true);
                  else setGoalId(e.target.value);
                }}
                className="bg-transparent border-none focus:ring-0 p-0 text-[1rem] flex-1 text-on-surface-variant outline-none truncate"
                required={goals.length > 0}
              >
                <option value="" disabled>Select Goal</option>
                {goals.map(g => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
                <option value="new" className="font-bold">+ New Goal</option>
              </select>
            )}
          </div>
          
          <button 
            type="submit"
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-[0.6875rem] font-bold uppercase tracking-[0.08em] transition-colors duration-0 active:bg-primary-dim whitespace-nowrap ml-auto"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
}
