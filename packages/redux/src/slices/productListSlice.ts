import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sort: null,
  filter: null,
  category: null,
  price: null,
};

export const productListSlice = createSlice({
  name: "product_list",
  initialState,
  reducers: {
    setSort: (state, { payload }) => {
      state.sort = payload;
    },
    setFilter: (state, { payload }) => {
      state.filter = payload;
    },
    setCategory: (state, { payload }) => {
      state.category = payload;
    },
    setPrice: (state, { payload }) => {
      state.price = payload;
    },
    clearAll: () => {
      return initialState;
    },
  },
});

export const { setSort, setFilter, setCategory, setPrice, clearAll } =
  productListSlice.actions;
