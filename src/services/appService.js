import api from '../api/axios';

export const generateId = prefix => `${prefix}_${crypto.randomUUID()}`;
export const logActivity = payload => api.post('/activity-logs', { ...payload, id: generateId('LOG') });
export const addNotification = payload => api.post('/notifications', { ...payload, id: generateId('NOTIF') });
