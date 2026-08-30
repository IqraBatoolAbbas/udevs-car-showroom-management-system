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
import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';

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
    settings: settingsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(() => next => action => {
    const result = next(action);
    const state = store.getState();
    if (action.type.startsWith('users/')) localStorageService.setData(STORAGE_KEYS.USERS, state.users.users);
    if (action.type.startsWith('cars/')) {
      localStorageService.setData(STORAGE_KEYS.CARS, state.cars.items);
      localStorageService.setData(STORAGE_KEYS.WISHLIST, state.cars.wishlist);
    }
    if (action.type.startsWith('suppliers/')) localStorageService.setData(STORAGE_KEYS.SUPPLIERS, state.suppliers.items);
    if (action.type.startsWith('customers/')) localStorageService.setData(STORAGE_KEYS.CUSTOMERS, state.customers.items);
    if (action.type.startsWith('applications/')) localStorageService.setData(STORAGE_KEYS.APPLICATIONS, state.applications.items);
    if (action.type.startsWith('notifications/')) localStorageService.setData(STORAGE_KEYS.NOTIFICATIONS, state.notifications.items);
    return result;
  })
});
