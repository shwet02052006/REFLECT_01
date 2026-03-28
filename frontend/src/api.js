import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('reflection_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    config.headers['x-user-id'] = user._id;
  }
  return config;
});

export const loginUser = (username) => api.post('/users/login', { username }).then(res => res.data);

export const getGoals = () => api.get('/goals').then(res => res.data);
export const createGoal = (data) => api.post('/goals', data).then(res => res.data);

export const getEntries = (date) => api.get('/entries', { params: { date } }).then(res => res.data);
export const createEntry = (data) => api.post('/entries', data).then(res => res.data);
export const getOverview = () => api.get('/entries/overview').then(res => res.data);

export default api;
