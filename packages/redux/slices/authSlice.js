import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    name: null,
    email: null,
    mobileNo: null,
    jwtToken: null,
  },
  reducers: {
    setUserAuthData: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setUserAuthData } = authSlice.actions;
