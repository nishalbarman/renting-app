import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type stateProps = {
  coordinates: any;
  address: any;
  defaultSelectedAddress?: any;
};

const initialState: stateProps = {
  defaultSelectedAddress: null,
  coordinates: null,
  address: null,
};

export const addressSlice = createSlice({
  name: "mapSelectedAddress",
  initialState,
  reducers: {
    setAddressDataFromMap: (state, { payload }: PayloadAction<stateProps>) => {
      state.coordinates = { ...payload.coordinates };
      state.address = {
        ...payload.address,
        name: payload?.address?.name,
        streetName: payload?.address?.thoroughfare,
      };
    },
    clearAddressData: () => {
      return initialState;
    },
  },
});

export const { setAddressDataFromMap, clearAddressData } = addressSlice.actions;
