import { createSlice } from "@reduxjs/toolkit";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderRefetch: 0,
  },
  reducers: {
    orderRefetch: (state) => {
      state.orderRefetch += 1;
    },
  },
});

export const { orderRefetch } = orderSlice.actions;
