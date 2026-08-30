import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const session = localStorageService.getData(STORAGE_KEYS.SESSION, null);

const toSession = (account) => ({
  id: account.id,
  email: account.email,
  name: account.name,
  role: account.role,
  status: account.status
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { getState, rejectWithValue }) => {
  const users = getState().users?.users?.length
    ? getState().users.users
    : localStorageService.getData(STORAGE_KEYS.USERS, []);
  const account = users.find(user => user.email?.toLowerCase() === email.trim().toLowerCase() && user.password === password);
  if (!account) return rejectWithValue('Invalid email or password');
  if (account.status !== 'active') return rejectWithValue('This account is inactive. Please contact an administrator.');
  const currentSession = toSession(account);
  localStorageService.setData(STORAGE_KEYS.SESSION, currentSession);
  localStorageService.logActivity({
    type: 'login',
    entity: 'user',
    entityId: account.id,
    description: `User ${account.email} logged in`
  });
  return currentSession;
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { getState }) => {
  const saved = localStorageService.getData(STORAGE_KEYS.SESSION, null);
  if (!saved) return null;
  const users = getState().users?.users?.length
    ? getState().users.users
    : localStorageService.getData(STORAGE_KEYS.USERS, []);
  const account = users.find(item => item.id === saved.id || item.email?.toLowerCase() === saved.email?.toLowerCase());
  if (account?.status === 'active') {
    const refreshed = toSession(account);
    localStorageService.setData(STORAGE_KEYS.SESSION, refreshed);
    return refreshed;
  }
  localStorageService.removeData(STORAGE_KEYS.SESSION);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: session, loading: false, initializing: true, error: null },
  reducers: {
    logout: (state) => {
      if (state.user) {
        localStorageService.logActivity({
          type: 'logout',
          entity: 'user',
          entityId: state.user.id,
          description: `User ${state.user.email} logged out`
        });
      }
      state.user = null;
      state.error = null;
      localStorageService.removeData(STORAGE_KEYS.SESSION);
    },
    updateCurrentUser: (state, action) => {
      state.user = state.user ? { ...state.user, ...action.payload } : state.user;
      if (state.user) localStorageService.setData(STORAGE_KEYS.SESSION, state.user);
    },
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Unable to sign in'; })
      .addCase(restoreSession.pending, state => { state.initializing = true; })
      .addCase(restoreSession.fulfilled, (state, action) => { state.initializing = false; state.user = action.payload; })
      .addCase(restoreSession.rejected, state => { state.initializing = false; state.user = null; });
  }
});

export const { logout, updateCurrentUser, clearAuthError } = authSlice.actions;
export const selectAuthUser = state => state.auth.user;
export const selectAuthLoading = state => state.auth.initializing;
export const selectIsAuthenticated = state => Boolean(state.auth.user);
export const selectAuthError = state => state.auth.error;
export default authSlice.reducer;
