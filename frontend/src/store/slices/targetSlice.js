import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchTargets = createAsyncThunk(
  'targets/fetchTargets',
  async () => {
    const response = await axios.get(`${API_URL}/targets`);
    return response.data;
  }
);

export const createTarget = createAsyncThunk(
  'targets/createTarget',
  async (targetData) => {
    const response = await axios.post(`${API_URL}/targets`, targetData);
    return response.data;
  }
);

const targetSlice = createSlice({
  name: 'targets',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTargets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTargets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTargets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTarget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  }
});

export default targetSlice.reducer; 