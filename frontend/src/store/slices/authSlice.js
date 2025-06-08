import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth';

// Helper function to format validation errors
const formatValidationError = (error) => {
  if (!error) return 'An error occurred';
  
  // Handle validation errors array
  if (error.response?.data?.errors) {
    const errorMessages = error.response.data.errors.map(err => err.msg);
    return errorMessages.join(', ');
  }
  
  // Handle string errors
  if (typeof error === 'string') return error;
  
  // Handle error objects
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  
  return 'An error occurred during login';
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (!credentials?.email || !credentials?.password) {
        return rejectWithValue('Email and password are required');
      }
      
      const response = await authService.login(credentials);
      if (!response?.token) {
        return rejectWithValue('Invalid response from server');
      }
      
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      const errorMessage = formatValidationError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { name, email, password } = userData;
      const response = await authService.register(name, email, password);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue(formatValidationError(error));
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
  }
);

// Stub for updateUserSettings
export const updateUserSettings = createAsyncThunk(
  'auth/updateUserSettings',
  async (settings, { rejectWithValue }) => {
    // Replace with actual API call
    try {
      // const response = await authService.updateSettings(settings);
      // return response;
      return settings; // stub
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Update user settings
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 