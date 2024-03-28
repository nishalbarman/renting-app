import { createSlice } from "@reduxjs/toolkit";

export const centerAddressSlice = createSlice({
  name: "selectedCenterDetails",
  initialState: {
    _id: null,
    centerName: null,
    name: null,
    streetName: null,
    locality: null,
    postalCode: null,
    longitude: null,
    longitude: null,
    country: null,
  },
  reducers: {
    setCenterAddress: (state, { payload }) => {
      state._id = payload._id;
      state.centerName = payload.centerName;
      state.name = payload.name;
      state.streetName = payload.streetName;
      state.locality = payload.locality;
      state.postalCode = payload.postalCode;
      state.longitude = payload.longitude;
      state.latitude = payload.latitude;
      state.country = payload.country;
    },
  },
});

export const { setCenterAddress } = centerAddressSlice.actions;
