import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async () => {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData) => {
    const response = await axios.post(`${API_URL}/reports`, reportData);
    return response.data;
  }
);

// Stub for deleteReport
export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      // const response = await axios.delete(`${API_URL}/reports/${reportId}`);
      // return reportId;
      return reportId; // stub
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Delete failed');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Handle deleteReport
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r._id !== action.payload);
      });
  }
});

export default reportSlice.reducer; 