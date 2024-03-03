import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userApi";
import { userSlice } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userSlice.name]: userSlice.reducer,
  },
});
