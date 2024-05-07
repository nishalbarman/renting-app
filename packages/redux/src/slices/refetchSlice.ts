import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const refetchSlice = createSlice({
  name: "refetch",
  initialState: {
    orderRefetch: 0,
    cartRefetch: 0,
    wishlistRefetch: 0,
    productRefetch: 0,
  },
  reducers: {
    orderRefetch: (state) => {
      state.orderRefetch += 1;
    },
    cartRefetch: (state) => {
      state.cartRefetch += 1;
    },
    wishlistRefetch: (state) => {
      state.wishlistRefetch += 1;
    },
    productRefetch: (state) => {
      state.productRefetch += 1;
    },
  },
});

export const { orderRefetch, cartRefetch, wishlistRefetch, productRefetch } =
  refetchSlice.actions;
