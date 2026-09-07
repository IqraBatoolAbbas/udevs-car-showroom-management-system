import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { carsApi, suppliersApi, customersApi, applicationsApi, notificationsApi, activityLogsApi, settingsApi } from '../../services/showroomApi';

const apis = { cars: carsApi, suppliers: suppliersApi, customers: customersApi, applications: applicationsApi, notifications: notificationsApi, activityLogs: activityLogsApi, settings: settingsApi };
const initialCollection = () => ({ items: [], loading: false, error: null, pagination: null });

export const fetchCollection = createAsyncThunk('showroom/fetchCollection', async ({ resource, params }, { rejectWithValue }) => {
  try {
    const result = await apis[resource].list(params);
    return { resource, result };
  } catch (error) {
    return rejectWithValue({ resource, message: error.response?.data?.message || 'Unable to load records' });
  }
});

export const createRecord = createAsyncThunk('showroom/createRecord', async ({ resource, payload }, { rejectWithValue }) => {
  try { return { resource, item: await apis[resource].create(payload) }; }
  catch (error) { return rejectWithValue({ resource, message: error.response?.data?.message || 'Unable to create record' }); }
});

export const updateRecord = createAsyncThunk('showroom/updateRecord', async ({ resource, id, payload }, { rejectWithValue }) => {
  try { return { resource, item: await apis[resource].update(id, payload) }; }
  catch (error) { return rejectWithValue({ resource, message: error.response?.data?.message || 'Unable to update record' }); }
});

export const deleteRecord = createAsyncThunk('showroom/deleteRecord', async ({ resource, id }, { rejectWithValue }) => {
  try { await apis[resource].remove(id); return { resource, id }; }
  catch (error) { return rejectWithValue({ resource, message: error.response?.data?.message || 'Unable to delete record' }); }
});

const showroomSlice = createSlice({
  name: 'showroom',
  initialState: Object.keys(apis).reduce((state, key) => ({ ...state, [key]: initialCollection() }), {}),
  reducers: { clearResourceError: (state, action) => { state[action.payload].error = null; } },
  extraReducers: builder => {
    const setLoading = (state, resource) => { state[resource].loading = true; state[resource].error = null; };
    builder
      .addCase(fetchCollection.pending, (state, action) => setLoading(state, action.meta.arg.resource))
      .addCase(fetchCollection.fulfilled, (state, action) => {
        const { resource, result } = action.payload;
        state[resource] = { items: Array.isArray(result) ? result : result.rows || [], pagination: result.pagination || null, loading: false, error: null };
      })
      .addCase(fetchCollection.rejected, (state, action) => { const { resource, message } = action.payload || {}; if (resource) { state[resource].loading = false; state[resource].error = message; } })
      .addCase(createRecord.fulfilled, (state, action) => { state[action.payload.resource].items.unshift(action.payload.item); })
      .addCase(updateRecord.fulfilled, (state, action) => {
        const collection = state[action.payload.resource];
        const index = collection.items.findIndex(item => item.id === action.payload.item.id);
        if (index >= 0) collection.items[index] = action.payload.item;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => { state[action.payload.resource].items = state[action.payload.resource].items.filter(item => item.id !== action.payload.id); })
      .addMatcher(action => [createRecord.rejected.type, updateRecord.rejected.type, deleteRecord.rejected.type].includes(action.type), (state, action) => {
        const { resource, message } = action.payload || {};
        if (resource) state[resource].error = message;
      });
  }
});

export const { clearResourceError } = showroomSlice.actions;
export default showroomSlice.reducer;
