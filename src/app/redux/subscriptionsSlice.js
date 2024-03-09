import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpBackendService } from '../services/httpbackend.service';

// Define the initial state
const initialState = {
  data: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', or 'failed'
  error: null,
};

// Create an async thunk for fetching subscriptions data
export const fetchSubscriptionsData = createAsyncThunk(
  'subscriptions/fetchSubscriptionsData',
  async () => {
    const httpBackendService = new HttpBackendService();

    try {
      const data = await httpBackendService.fetchData("subscriptions");
      console.info('fetching subscriptions data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching subscriptions data:', error);
      throw error; // Rethrow the error to let createAsyncThunk handle it
    }
  }
);

// Create a slice for subscriptions
const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubscriptionsData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSubscriptionsData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default subscriptionsSlice.reducer;
