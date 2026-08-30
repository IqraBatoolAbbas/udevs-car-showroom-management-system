import { createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const settings = localStorageService.getData(STORAGE_KEYS.SETTINGS, {});
const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: settings.themeMode === 'dark' ? 'dark' : 'light' },
  reducers: {
    toggleTheme: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorageService.setData(STORAGE_KEYS.SETTINGS, {
        ...localStorageService.getData(STORAGE_KEYS.SETTINGS, {}),
        themeMode: state.mode
      });
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload === 'dark' ? 'dark' : 'light';
      localStorageService.setData(STORAGE_KEYS.SETTINGS, {
        ...localStorageService.getData(STORAGE_KEYS.SETTINGS, {}),
        themeMode: state.mode
      });
    }
  }
});

export const { toggleTheme, setThemeMode } = themeSlice.actions;
export const selectThemeMode = state => state.theme.mode;
export default themeSlice.reducer;

