import { configureStore } from '@reduxjs/toolkit';
import subscriptionsReducer from './subscriptionsSlice';

const store = configureStore({
  reducer: {
    subscriptions: subscriptionsReducer,
  },
});

export default store;