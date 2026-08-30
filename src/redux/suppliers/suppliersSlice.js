import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: { items: localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []) },
  reducers: {
    setSuppliers: (state, action) => { state.items = action.payload || []; },
    addSupplier: (state, action) => { state.items.push(action.payload); },
    updateSupplier: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    removeSupplier: (state, action) => { state.items = state.items.filter(item => item.id !== action.payload); }
  }
});

export const { setSuppliers, addSupplier, updateSupplier, removeSupplier } = suppliersSlice.actions;
export const selectSuppliers = state => state.suppliers.items;
export default suppliersSlice.reducer;

