import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const carsSlice = createSlice({
  name: 'cars',
  initialState: {
    items: localStorageService.getData(STORAGE_KEYS.CARS, []),
    wishlist: localStorageService.getData(STORAGE_KEYS.WISHLIST, []),
    loading: false,
    error: null
  },
  reducers: {
    setCars: (state, action) => { state.items = action.payload || []; },
    addCar: (state, action) => { state.items.push(action.payload); },
    updateCar: (state, action) => {
      const index = state.items.findIndex(car => car.id === action.payload.id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
    },
    removeCar: (state, action) => { state.items = state.items.filter(car => car.id !== action.payload); },
    toggleWishlist: (state, action) => {
      state.wishlist = state.wishlist.includes(action.payload)
        ? state.wishlist.filter(id => id !== action.payload)
        : [...state.wishlist, action.payload];
    },
    setWishlist: (state, action) => { state.wishlist = action.payload || []; }
  }
});

export const { setCars, addCar, updateCar, removeCar, toggleWishlist, setWishlist } = carsSlice.actions;
export const selectCars = state => state.cars.items;
export const selectWishlist = state => state.cars.wishlist;
export default carsSlice.reducer;

