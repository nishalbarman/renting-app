import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
  name: string | null;
  email: string | null;
  mobileNo: string | null;
  jwtToken: string | null;
  defaultSelectedAddress: string | null;
};

const initialState: User = {
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
    setUserAuthData: (state, action: PayloadAction<User>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.mobileNo = action.payload.mobileNo;
      state.jwtToken = action.payload.jwtToken;
    },
    updateDefaultSelectedAddress: (state, action: PayloadAction<string>) => {
      state.defaultSelectedAddress = action.payload;
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
