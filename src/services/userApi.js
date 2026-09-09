import api from '../api/axios';

const roleToUserType = { admin: 'admin', inventory: 'teamlead', sales: 'employee', customer: 'employee' };
const unwrap = data => data?.data ?? data;
const normalizeUser = user => user ? {
  ...user,
  role: user.role || ({ admin: 'admin', teamlead: 'inventory', employee: 'sales' }[user.userType] || 'sales'),
  status: user.status || 'active',
  createdAt: user.createdAt || user.joiningDate
} : user;
const toApiPayload = payload => ({
  ...payload,
  userType: payload.userType || roleToUserType[payload.role] || 'employee'
});

export const getUsersApi = async () => {
  const response = await api.get('/users');
  const users = unwrap(response.data);
  return (users?.users || users || []).map(normalizeUser);
};

export const createUserApi = async payload => {
  const response = await api.post('/users', toApiPayload(payload));
  const data = unwrap(response.data);
  return normalizeUser(data?.newUser || data?.user || data);
};

export const updateUserApi = async (id, payload) => {
  const response = await api.put('/users', { ...toApiPayload(payload), id });
  return normalizeUser(unwrap(response.data));
};

export const deleteUserApi = async id => {
  await api.delete(`/users/${id}`);
  return { id };
};

export default api;
