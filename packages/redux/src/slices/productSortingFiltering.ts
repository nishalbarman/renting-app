import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type stateProps = {
  sort: {
    id: number;
    value: string;
  };
  filter: {
    color: null | string;
    category: null | string;
    price: null | number;
  };
};

const initialState: stateProps = {
  sort: {
    id: 0,
    value: "",
  },
  filter: {
    color: "",
    category: "",
    price: null,
  },
};

export const productSortingFilteringSlice = createSlice({
  name: "sort_filter_products",
  initialState,
  reducers: {
    setSort: (
      state,
      action: PayloadAction<{
        id: number;
        value: string;
      }>
    ) => {
      state.sort = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<{
        color: null | string;
        category: null | string;
        price: null | number;
      }>
    ) => {
      state.filter = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.filter.price = action.payload;
    },
    clearAll: () => {
      return initialState;
    },
  },
});

export const { setSort, setFilter, setCategory, setPrice, clearAll } =
  productSortingFilteringSlice.actions;
