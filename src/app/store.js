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
  }
});
