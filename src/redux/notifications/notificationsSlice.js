import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS, []) },
  reducers: {
    setNotifications: (state, action) => { state.items = action.payload || []; },
    addNotification: (state, action) => { state.items.unshift(action.payload); },
    markNotificationRead: (state, action) => {
      const item = state.items.find(notification => notification.id === action.payload);
      if (item) item.read = true;
    },
    markAllNotificationsRead: state => { state.items.forEach(notification => { notification.read = true; }); },
    removeNotification: (state, action) => { state.items = state.items.filter(item => item.id !== action.payload); }
  }
});

export const {
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification
} = notificationsSlice.actions;
export const selectNotifications = state => state.notifications.items;
export default notificationsSlice.reducer;

