import { configureStore } from '@reduxjs/toolkit';
import commonFeature from './common-slice';

export const store = configureStore({
  reducer: {
    commonFeature,
  },
});
