import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

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
  initialState: { data: { ...defaults, ...localStorageService.getData(STORAGE_KEYS.SETTINGS, {}) }, loading: false },
  reducers: {
    updateSettings: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      localStorageService.setData(STORAGE_KEYS.SETTINGS, state.data);
    },
    resetSettings: state => {
      state.data = { ...defaults };
      localStorageService.setData(STORAGE_KEYS.SETTINGS, state.data);
    }
  }
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export const selectSettings = state => state.settings.data;
export default settingsSlice.reducer;

