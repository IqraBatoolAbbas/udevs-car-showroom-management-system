import { createSlice } from '@reduxjs/toolkit';
const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' },
  reducers: {
    toggleTheme: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload === 'dark' ? 'dark' : 'light';
    }
  }
});

export const { toggleTheme, setThemeMode } = themeSlice.actions;
export const selectThemeMode = state => state.theme.mode;
export default themeSlice.reducer;
