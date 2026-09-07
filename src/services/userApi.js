import api from '../api/axios';

const unwrap = response => response.data?.data ?? response.data;
const normalizeUser = user => ({
  ...user,
  role: user.role || ({ admin: 'admin', teamlead: 'inventory', employee: 'sales' }[user.userType] || 'sales'),
  status: user.status || 'active',
  createdAt: user.createdAt || user.joiningDate
});

export const getUsersApi = async () => {
  const response = await api.get('/users');
  const data = unwrap(response);
  return (data?.users || data || []).map(normalizeUser);
};
export const createUserApi = async payload => {
  const response = await api.post('/users', { ...payload, role: payload.role || 'customer' });
  return normalizeUser(unwrap(response));
};
export const updateUserApi = async (id, payload) => {
  const response = await api.put('/users', { ...payload, id });
  return normalizeUser(unwrap(response));
};
export const deleteUserApi = async id => {
  await api.delete(`/users/${id}`);
  return { id };
};
export default api;
