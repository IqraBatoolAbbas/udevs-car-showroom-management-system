import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/users/userSlice';
import authReducer from '../redux/auth/authSlice';
import themeReducer from '../redux/theme/themeSlice';
import carsReducer from '../redux/cars/carsSlice';
import suppliersReducer from '../redux/suppliers/suppliersSlice';
import customersReducer from '../redux/customers/customersSlice';
import applicationsReducer from '../redux/applications/applicationsSlice';
import notificationsReducer from '../redux/notifications/notificationsSlice';
import settingsReducer from '../redux/settings/settingsSlice';
import showroomReducer from '../redux/showroom/showroomSlice';
import { carsApi, suppliersApi, customersApi, applicationsApi, notificationsApi, settingsApi } from '../services/showroomApi';

const apiSyncMiddleware = () => next => action => {
  const result = next(action);
  const payload = action.payload;
  const sync = promise => promise.catch(error => console.error('API synchronization failed', error));
  if (action.type === 'cars/addCar') sync(carsApi.create(payload));
  if (action.type === 'cars/updateCar') sync(carsApi.update(payload.id, payload));
  if (action.type === 'cars/removeCar') sync(carsApi.remove(payload));
  if (action.type === 'suppliers/addSupplier') sync(suppliersApi.create(payload));
  if (action.type === 'suppliers/updateSupplier') sync(suppliersApi.update(payload.id, payload));
  if (action.type === 'suppliers/removeSupplier') sync(suppliersApi.remove(payload));
  if (action.type === 'customers/addCustomer') sync(customersApi.create(payload));
  if (action.type === 'customers/updateCustomer') sync(customersApi.update(payload.id, payload));
  if (action.type === 'customers/removeCustomer') sync(customersApi.remove(payload));
  if (action.type === 'applications/addApplication') sync(applicationsApi.create(payload));
  if (action.type === 'applications/updateApplication') sync(applicationsApi.update(payload.id, payload));
  if (action.type === 'applications/removeApplication') sync(applicationsApi.remove(payload));
  if (action.type === 'notifications/addNotification') sync(notificationsApi.create(payload));
  if (action.type === 'notifications/markNotificationRead') sync(notificationsApi.update(payload, { read: true }));
  if (action.type === 'notifications/removeNotification') sync(notificationsApi.remove(payload));
  if (action.type === 'settings/updateSettings') sync(settingsApi.update('system', { value: payload }).catch(() => settingsApi.create({ key: 'system', value: payload })));
  return result;
};

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    theme: themeReducer,
    cars: carsReducer,
    suppliers: suppliersReducer,
    customers: customersReducer,
    applications: applicationsReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
    showroom: showroomReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSyncMiddleware)
});
