import { createSlice } from '@reduxjs/toolkit';

const defaults = {
  showroomName: 'U Devs Car Showroom',
  currency: 'PKR',
  dateFormat: 'DD/MM/YYYY',
  lowStockThreshold: 3,
  enableNotifications: true,
  enableEmailAlerts: false,
  companyAddress: '123 Business Avenue, Gulberg III, Lahore',
  companyPhone: '+92-42-111-UDEVS',
  companyEmail: 'info@udevs-showroom.com'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: { ...defaults }, loading: false },
  reducers: {
    updateSettings: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    resetSettings: state => {
      state.data = { ...defaults };
    }
  }
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export const selectSettings = state => state.settings.data;
export default settingsSlice.reducer;
