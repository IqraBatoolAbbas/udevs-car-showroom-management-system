import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, createUser, updateUser, deleteUser } from './userActions';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';

const initialState = {
  users: localStorageService.getData(STORAGE_KEYS.USERS, []),
  selectedUser: null,
  loading: false,
  error: null,
  success: false
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    hydrateUsers: (state, action) => { state.users = action.payload || []; },
    clearUserError: (state) => { state.error = null; },
    clearUserSuccess: (state) => { state.success = false; },
    setSelectedUser: (state, action) => { state.selectedUser = action.payload; },
    clearSelectedUser: (state) => { state.selectedUser = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create user';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        state.success = true;
        state.selectedUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  }
});

export const {
  clearUserError,
  hydrateUsers,
  clearUserSuccess,
  setSelectedUser,
  clearSelectedUser
} = userSlice.actions;

export default userSlice.reducer;
