// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // ✅ Use serializableCheck override here directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/setSocketConnection'],
        ignoredPaths: ['user.socketConnection'],
      },
    }),
});