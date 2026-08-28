import axios from 'axios';
import localStorageService, { STORAGE_KEYS } from './localStorageService';

const API_URL = import.meta.env.VITE_API_URL;

const userApi = axios.create({
  baseURL: API_URL || undefined,
  headers: { 'Content-Type': 'application/json' }
});

const useLocalStorage = !API_URL;
const getStoredUsers = () => localStorageService.getData(STORAGE_KEYS.USERS, []);
const saveStoredUsers = (users) => localStorageService.setData(STORAGE_KEYS.USERS, users);

const unwrap = (data) => data?.data ?? data;

export const getUsersApi = async () => {
  if (useLocalStorage) return getStoredUsers();
  const response = await userApi.get('/users');
  return unwrap(response.data);
};

export const createUserApi = async (payload) => {
  if (useLocalStorage) {
    const user = {
      id: localStorageService.generateId('USR'),
      ...payload,
      createdAt: new Date().toISOString()
    };
    saveStoredUsers([...getStoredUsers(), user]);
    return user;
  }
  const response = await userApi.post('/users', payload);
  return unwrap(response.data);
};

export const updateUserApi = async (id, payload) => {
  if (useLocalStorage) {
    const users = getStoredUsers();
    const user = users.find((item) => item.id === id);
    if (!user) throw new Error('User not found');
    const updatedUser = { ...user, ...payload, updatedAt: new Date().toISOString() };
    saveStoredUsers(users.map((item) => item.id === id ? updatedUser : item));
    return updatedUser;
  }
  const response = await userApi.put(`/users/${id}`, payload);
  return unwrap(response.data);
};

export const deleteUserApi = async (id) => {
  if (useLocalStorage) {
    const users = getStoredUsers();
    if (!users.some((item) => item.id === id)) throw new Error('User not found');
    saveStoredUsers(users.filter((item) => item.id !== id));
    return { id };
  }
  const response = await userApi.delete(`/users/${id}`);
  return unwrap(response.data);
};

export default userApi;
