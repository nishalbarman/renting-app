import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    name: null,
    email: null,
    mobileNo: null,
    jwtToken: null,
    defaultSelectedAddress: null,
  },
  reducers: {
    setUserAuthData: (state, { payload }) => {
      state.name = payload.name;
      state.email = payload.email;
      state.mobileNo = payload.mobileNo;
      state.jwtToken = payload.jwtToken;
    },
    updateDefaultSelectedAddress: (state, { payload }) => {
      state.defaultSelectedAddress = payload;
    },
  },
});

export const { setUserAuthData, updateDefaultSelectedAddress } =
  authSlice.actions;
