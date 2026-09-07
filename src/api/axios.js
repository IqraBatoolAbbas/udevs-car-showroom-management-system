import axios from 'axios';
import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

api.interceptors.request.use(config => {
  const session = localStorageService.getData(STORAGE_KEYS.SESSION, {});
  if (session.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) localStorageService.removeData(STORAGE_KEYS.SESSION);
  return Promise.reject(error);
});

export default api;
