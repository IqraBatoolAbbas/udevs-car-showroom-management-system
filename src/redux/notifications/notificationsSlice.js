import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
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
