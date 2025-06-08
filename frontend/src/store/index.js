import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scanReducer from './slices/scanSlice';
import targetReducer from './slices/targetSlice';
import reportReducer from './slices/reportSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    scans: scanReducer,
    targets: targetReducer,
    reports: reportReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 