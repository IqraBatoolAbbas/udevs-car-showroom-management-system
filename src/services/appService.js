import api from '../api/axios';

export const generateId = prefix => `${prefix}_${crypto.randomUUID()}`;
export const logActivity = payload => api.post('/activity-logs', { ...payload, id: generateId('LOG') })
  .catch(error => { console.error('Unable to record activity log', error); return null; });
export const addNotification = payload => api.post('/notifications', { ...payload, id: generateId('NOTIF') })
  .catch(error => { console.error('Unable to create notification', error); return null; });
