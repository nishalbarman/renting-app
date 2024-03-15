import { createSlice } from "@reduxjs/toolkit";

export const addressSlice = createSlice({
  name: "mapSelectedAddress",
  initialState: {
    coordinates: null,
    address: null,
  },
  reducers: {
    setAddressDataFromMap: (state, { payload }) => {
      state.coordinates = { ...payload.coordinates };
      state.address = {
        ...payload.address,
        name: payload?.address?.name,
        streetName: payload?.address?.thoroughfare,
      };
    },
  },
});

export const { setAddressDataFromMap } = addressSlice.actions;
