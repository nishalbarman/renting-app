import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // productType: "rent",
  productType: "buy",
};

export const storeTypeSlice = createSlice({
  name: "product_store",
  initialState,
  reducers: {
    setProductType: (state, action) => {
      state.productType = action.payload;
    },
  },
});

export const { setProductType } = storeTypeSlice.actions;
