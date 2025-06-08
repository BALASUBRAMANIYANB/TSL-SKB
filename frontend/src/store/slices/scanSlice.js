import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchScans = createAsyncThunk(
  'scans/fetchScans',
  async () => {
    const response = await axios.get(`${API_URL}/scans`);
    return response.data;
  }
);

export const createScan = createAsyncThunk(
  'scans/createScan',
  async (scanData) => {
    const response = await axios.post(`${API_URL}/scans`, scanData);
    return response.data;
  }
);

export const updateScan = createAsyncThunk(
  'scans/updateScan',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/scans/${id}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

// Stub for deleteScan
export const deleteScan = createAsyncThunk(
  'scans/deleteScan',
  async (scanId, { rejectWithValue }) => {
    try {
      // const response = await axios.delete(`${API_URL}/scans/${scanId}`);
      // return scanId;
      return scanId; // stub
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Delete failed');
    }
  }
);

const scanSlice = createSlice({
  name: 'scans',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchScans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createScan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateScan.fulfilled, (state, action) => {
        const index = state.items.findIndex(scan => scan._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Handle deleteScan
      .addCase(deleteScan.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s._id !== action.payload);
      });
  }
});

export default scanSlice.reducer; 