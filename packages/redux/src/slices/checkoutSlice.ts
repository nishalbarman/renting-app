import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SingleCheckoutState = {
  address: string | undefined;
  productId: string | undefined;
  productVariant: string | undefined;
};

type CartCheckoutState = {
  address: string | undefined;
};

const initialState: {
  cartCheckout: CartCheckoutState;
  singleCheckout: SingleCheckoutState;
} = {
  cartCheckout: { address: undefined },
  singleCheckout: {
    address: undefined,
    productId: undefined,
    productVariant: undefined,
  },
};

export const checkoutInformationSlice = createSlice({
  name: "checkout_informations",
  initialState,
  reducers: {
    setCartCheckout: (state, action: PayloadAction<CartCheckoutState>) => {
      state.cartCheckout = action.payload;
    },
    setSingleCheckout: (state, action: PayloadAction<SingleCheckoutState>) => {
      state.cartCheckout = { ...state.cartCheckout, ...action.payload };
    },
    clearCheckoutInformation: () => {
      return initialState;
    },
  },
});

export const { setCartCheckout, setSingleCheckout } =
  checkoutInformationSlice.actions;
