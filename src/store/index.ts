import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';

export * from './slices/authSlice';
export * from './slices/themeSlice';

const staticReducers = {
  auth: authReducer,
  theme: themeReducer,
};

function createReducer(asyncReducers = {}) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}

export function configureAppStore() {
  const store = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  }) as any;

  store.asyncReducers = {};

  store.injectReducer = (key: string, asyncReducer: Reducer) => {
    if (store.asyncReducers[key]) return;
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  return store;
}

// Single instance of store to be imported
export const store = configureAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
