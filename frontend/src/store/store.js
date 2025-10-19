// ==================== frontend/src/store/store.js ====================
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    ui: uiReducer
  }
});