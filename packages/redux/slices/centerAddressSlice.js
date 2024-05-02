import { createSlice } from "@reduxjs/toolkit";

export const centerAddressSlice = createSlice({
  name: "selectedCenterDetails",
  initialState: {
    _id: null,
    centerName: null,
    address: {
      name: null,
      streetName: null,
      locality: null,
      postalCode: null,
      longitude: null,
      longitude: null,
      country: null,
    },
    user: {},
  },
  reducers: {
    setCenterAddress: (state, { payload }) => {
      state._id = payload._id;
      state.centerName = payload.centerName;
      state.address = payload.address;
      state.user = payload.user;
    },
  },
});

export const { setCenterAddress } = centerAddressSlice.actions;
