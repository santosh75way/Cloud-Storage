import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { storageApi } from "../services/storageApi";
import { sharingApi } from "../services/sharingApi";
import { publicLinksApi } from "../services/publicLinksApi";
import { adminApi } from "../services/adminApi";
import { searchApi } from "../services/searchApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [storageApi.reducerPath]: storageApi.reducer,
    [sharingApi.reducerPath]: sharingApi.reducer,
    [publicLinksApi.reducerPath]: publicLinksApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      storageApi.middleware,
      sharingApi.middleware,
      publicLinksApi.middleware,
      adminApi.middleware,
      searchApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
