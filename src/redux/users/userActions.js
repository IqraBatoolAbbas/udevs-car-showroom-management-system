import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi
} from '../../services/userApi';

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try {
    const users = await getUsersApi();
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to fetch users'));
  }
});

export const createUser = createAsyncThunk('users/createUser', async (payload, thunkAPI) => {
  try {
    return await createUserApi(payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to create user'));
  }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, payload }, thunkAPI) => {
  try {
    return await updateUserApi(id, payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to update user'));
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, thunkAPI) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to delete user'));
  }
});
