import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['canvas.canvas'],
      ignoredActions: ['canvas/setCanvas'],
    },
  }),
});

export default store;
