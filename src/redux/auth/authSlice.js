import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const userFromResponse = response => response.data?.data?.user || response.data?.data;

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return userFromResponse(await api.post('/auth/login', credentials));
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to sign in');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return userFromResponse(await api.post('/auth/register', payload));
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Unable to register');
  }
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    return userFromResponse(await api.get('/auth/me'));
  } catch (error) {
    if (error.response?.status === 401) return null;
    return rejectWithValue(error.response?.data?.message || 'Unable to restore session');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try { await api.post('/auth/logout'); return null; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Unable to log out'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, initializing: true, error: null },
  reducers: {
    updateCurrentUser: (state, action) => { state.user = state.user ? { ...state.user, ...action.payload } : state.user; },
    clearAuthError: state => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.fulfilled, (state, action) => { state.user = action.payload; state.error = null; })
      .addCase(register.rejected, (state, action) => { state.error = action.payload; })
      .addCase(restoreSession.pending, state => { state.initializing = true; })
      .addCase(restoreSession.fulfilled, (state, action) => { state.initializing = false; state.user = action.payload; })
      .addCase(restoreSession.rejected, state => { state.initializing = false; state.user = null; })
      .addCase(logout.fulfilled, state => { state.user = null; state.error = null; })
      .addCase(logout.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { updateCurrentUser, clearAuthError } = authSlice.actions;
export const selectAuthUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.initializing;
export const selectIsAuthenticated = state => Boolean(state.auth.user);
export const selectAuthError = state => state.auth.error;
export default authSlice.reducer;
