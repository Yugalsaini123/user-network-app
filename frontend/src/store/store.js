// ==================== frontend/src/store/store.js ====================
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import uiReducer from './uiSlice.js';

export const store = configureStore({
  reducer: {
    users: userReducer,
    ui: uiReducer
  }
});