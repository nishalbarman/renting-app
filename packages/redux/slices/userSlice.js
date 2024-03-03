import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: null,
    email: null,
    mobileNo: null,
    jwtToken: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
