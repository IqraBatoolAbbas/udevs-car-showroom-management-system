import api from '../api/axios';

const unwrap = response => response.data?.data ?? response.data;
const resource = name => ({
  list: params => api.get(`/${name}`, { params }).then(unwrap),
  get: id => api.get(`/${name}/${id}`).then(unwrap),
  create: payload => api.post(`/${name}`, payload).then(unwrap),
  update: (id, payload) => api.put(`/${name}/${id}`, payload).then(unwrap),
  remove: id => api.delete(`/${name}/${id}`).then(unwrap)
});

export const carsApi = resource('cars');
export const suppliersApi = resource('suppliers');
export const customersApi = resource('customers');
export const applicationsApi = {
  ...resource('applications'),
  updateStatus: (id, payload) => api.patch(`/applications/${id}/status`, payload).then(unwrap)
};
export const notificationsApi = resource('notifications');
export const activityLogsApi = resource('activity-logs');
export const settingsApi = resource('settings');
