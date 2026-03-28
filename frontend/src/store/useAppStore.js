import { create } from 'zustand';
import { getGoals, getEntries, createEntry, createGoal, loginUser } from '../api.js';

const useAppStore = create((set, get) => ({
  user: localStorage.getItem('reflection_user') ? JSON.parse(localStorage.getItem('reflection_user')) : null,
  goals: [],
  entries: [],
  selectedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  view: 'daily', // 'daily', 'calendar', 'overview'
  
  login: async (username) => {
    try {
      const user = await loginUser(username);
      localStorage.setItem('reflection_user', JSON.stringify(user));
      set({ user });
      await get().fetchGoals();
      await get().fetchEntries();
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check the backend connection.');
    }
  },

  logout: () => {
    localStorage.removeItem('reflection_user');
    set({ user: null, goals: [], entries: [] });
  },
  
  setView: (view) => set({ view }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchGoals: async () => {
    try {
      const goals = await getGoals();
      set({ goals });
    } catch (error) {
      console.error('Failed to fetch goals', error);
    }
  },

  fetchEntries: async (date) => {
    try {
      const entries = await getEntries(date || get().selectedDate);
      set({ entries });
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  },

  addEntry: async (entryData) => {
    try {
      const newEntry = await createEntry(entryData);
      set((state) => ({ entries: [newEntry, ...state.entries] }));
    } catch (error) {
      console.error('Failed to add entry', error);
    }
  },

  addGoal: async (goalData) => {
    try {
      const newGoal = await createGoal(goalData);
      set((state) => ({ goals: [...state.goals, newGoal] }));
      return newGoal;
    } catch (error) {
      console.error('Failed to add goal', error);
      throw error;
    }
  }
}));

export default useAppStore;
