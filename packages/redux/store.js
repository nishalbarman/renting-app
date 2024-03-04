import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userApi";
import { authSlice } from "./slices/authSlice";
import { authApi } from "./apis/authApi";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [authSlice.name]: authSlice.reducer,
  },
});
