import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const customersSlice = createSlice({
  name: 'customers',
  initialState: { items: localStorageService.getData(STORAGE_KEYS.CUSTOMERS, []) },
  reducers: {
    setCustomers: (state, action) => { state.items = action.payload || []; },
    addCustomer: (state, action) => { state.items.push(action.payload); },
    updateCustomer: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    removeCustomer: (state, action) => { state.items = state.items.filter(item => item.id !== action.payload); }
  }
});

export const { setCustomers, addCustomer, updateCustomer, removeCustomer } = customersSlice.actions;
export const selectCustomers = state => state.customers.items;
export default customersSlice.reducer;

