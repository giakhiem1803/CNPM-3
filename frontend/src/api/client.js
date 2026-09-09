import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') window.location.assign('/login');
  }
  return Promise.reject(new Error(error.response?.data?.message || 'Không thể kết nối máy chủ.'));
});
