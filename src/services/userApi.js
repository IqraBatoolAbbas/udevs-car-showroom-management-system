import axios from 'axios';
import localStorageService, { STORAGE_KEYS } from './localStorageService';

const API_URL = import.meta.env.VITE_API_URL;
console.log("Current API_URL:", import.meta.env.VITE_API_URL);
const userApi = axios.create({
  baseURL: API_URL || undefined,
  headers: { 'Content-Type': 'application/json' }
});

userApi.interceptors.request.use((config) => {
  const session = localStorageService.getData(STORAGE_KEYS.SESSION, {});
  const storedUser = localStorageService.getData('user', {});
  const token = session.token || storedUser.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const useLocalStorage = !API_URL;
const getStoredUsers = () => localStorageService.getData(STORAGE_KEYS.USERS, []);
const saveStoredUsers = (users) => localStorageService.setData(STORAGE_KEYS.USERS, users);

const roleToUserType = { admin: 'admin', inventory: 'teamlead', sales: 'employee', customer: 'employee' };
const userTypeToRole = { admin: 'admin', teamlead: 'inventory', employee: 'sales' };

const normalizeUser = (user) => user ? {
  ...user,
  role: user.role || userTypeToRole[user.userType] || 'sales',
  status: user.status || 'active',
  createdAt: user.createdAt || user.joiningDate
} : user;

const toApiPayload = (payload) => ({
  ...payload,
  userType: payload.userType || roleToUserType[payload.role] || 'employee'
});

const unwrap = (data) => data?.data ?? data;

export const getUsersApi = async () => {
  if (useLocalStorage) return getStoredUsers();
  const response = await userApi.get('/user');
  const users = unwrap(response.data)?.users || unwrap(response.data);
  return Array.isArray(users) ? users.map(normalizeUser) : [];
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
  const response = await userApi.post('/user', toApiPayload(payload));
  return normalizeUser(unwrap(response.data)?.newUser || unwrap(response.data));
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
  const response = await userApi.put('/user', { ...toApiPayload(payload), id });
  return normalizeUser(unwrap(response.data));
};

export const deleteUserApi = async (id) => {
  if (useLocalStorage) {
    const users = getStoredUsers();
    if (!users.some((item) => item.id === id)) throw new Error('User not found');
    saveStoredUsers(users.filter((item) => item.id !== id));
    return { id };
  }
  const response = await userApi.delete(`/user/${id}`);
  return normalizeUser(unwrap(response.data));
};

export default userApi;
