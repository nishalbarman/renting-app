import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  email: null,
  mobileNo: null,
  jwtToken: null,
  defaultSelectedAddress: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
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
    clearLoginSession: () => {
      return initialState;
    },
  },
});

export const {
  setUserAuthData,
  updateDefaultSelectedAddress,
  clearLoginSession,
} = authSlice.actions;
