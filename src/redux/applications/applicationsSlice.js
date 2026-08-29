import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: { items: localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []) },
  reducers: {
    setApplications: (state, action) => { state.items = action.payload || []; },
    addApplication: (state, action) => { state.items.unshift(action.payload); },
    updateApplication: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    removeApplication: (state, action) => { state.items = state.items.filter(item => item.id !== action.payload); }
  }
});

export const { setApplications, addApplication, updateApplication, removeApplication } = applicationsSlice.actions;
export const selectApplications = state => state.applications.items;
export default applicationsSlice.reducer;

