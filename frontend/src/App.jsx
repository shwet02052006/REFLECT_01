import React, { useEffect } from 'react';
import useAppStore from './store/useAppStore';
import DailyEntryScreen from './components/DailyEntryScreen';
import CalendarView from './components/CalendarView';
import GoalOverview from './components/GoalOverview';
import Login from './components/Login';

function App() {
  const { view, setView, fetchGoals, fetchEntries, user, logout } = useAppStore();

  useEffect(() => {
    if (user) {
      fetchGoals();
      fetchEntries();
    }
  }, [fetchGoals, fetchEntries, user]);

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <nav className="bg-[#f9f9f8] fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-lg mx-auto">
          <button className="text-[#4f6263] hover:bg-[#f1f4f3] p-2 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-['Inter'] font-light tracking-[-0.04em] text-[1.5rem] text-[#4f6263]">Chronos</h1>
          <button onClick={logout} className="text-[#4f6263] hover:bg-[#f1f4f3] p-2 rounded-full flex items-center justify-center cursor-pointer" title="Log out">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-6 pt-28 pb-32 min-h-screen">
        {view === 'daily' && <DailyEntryScreen />}
        {view === 'calendar' && <CalendarView />}
        {view === 'overview' && <GoalOverview />}
      </main>
      
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#f9f9f8] border-t border-[#eaefee]/20 shadow-[0_-10px_40px_rgba(44,52,51,0.06)]">
        <button 
          onClick={() => setView('daily')}
          className={`flex flex-col items-center justify-center rounded-xl p-3 ${view === 'daily' ? 'bg-[#dce4e3] text-[#2c3433]' : 'text-[#586160] hover:text-[#4f6263]'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: view === 'daily' ? "'FILL' 1" : "'FILL' 0" }}>today</span>
        </button>
        <button 
          onClick={() => setView('overview')}
          className={`flex flex-col items-center justify-center rounded-xl p-3 ${view === 'overview' ? 'bg-[#dce4e3] text-[#2c3433]' : 'text-[#586160] hover:text-[#4f6263]'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: view === 'overview' ? "'FILL' 1" : "'FILL' 0" }}>emoji_events</span>
        </button>
        <button 
          onClick={() => setView('calendar')}
          className={`flex flex-col items-center justify-center rounded-xl p-3 ${view === 'calendar' ? 'bg-[#dce4e3] text-[#2c3433]' : 'text-[#586160] hover:text-[#4f6263]'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: view === 'calendar' ? "'FILL' 1" : "'FILL' 0" }}>calendar_today</span>
        </button>
      </nav>
    </>
  );
}

export default App;
