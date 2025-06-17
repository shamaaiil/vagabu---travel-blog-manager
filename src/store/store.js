import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "../services/apiService";

// Combine reducers
const rootReducer = combineReducers({
//   auth: authReducer,
//   team: teamReducer,
//   projects: projectReducer,

  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dealers"], // Persist both the auth and dealer slices
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "auth/logout"], // Ignore Redux Persist actions
      },
    }).concat(apiSlice.middleware),
});

// Create the persistor
export const persistor = persistStore(store);
