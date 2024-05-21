import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userApi";
import { addressSlice } from "./slices/addressSlice";
import { authApi } from "./apis/authApi";
import { addressApi } from "./apis/addressApi";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setupListeners } from "@reduxjs/toolkit/query";
import { wishlistApi } from "./apis/wishlistApi";
// import { productsApi } from "./apis/productApi.ts.bak";
import { categoryApi } from "./apis/categoryApi";
import { storeTypeSlice } from "./slices/storeTypeSlice";
import { cartApi } from "./apis/cartApi";
import { centerAddressSlice } from "./slices/centerAddressSlice";
import { centerAddressApi } from "./apis/centerAddresApi";
// import { orderSlice } from "./slices/orderSlice";
import { productSortingFilteringSlice } from "./slices/productSortingFiltering";
import { authSlice } from "./slices/authSlice";
import { refetchSlice } from "./slices/refetchSlice";
import { globalMessage } from "./slices/messageSlice";
import { checkoutInformationSlice } from "./slices/checkoutSlice";

const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [addressSlice.name]: addressSlice.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  // [productsApi.reducerPath]: productsApi.reducer,
  [productSortingFilteringSlice.name]: productSortingFilteringSlice.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [storeTypeSlice.name]: storeTypeSlice.reducer,
  [checkoutInformationSlice.name]: checkoutInformationSlice.reducer,
  // [orderSlice.name]: orderSlice.reducer,
  [centerAddressApi.reducerPath]: centerAddressApi.reducer,
  [centerAddressSlice.name]: centerAddressSlice.reducer,

  // refetch slice
  [refetchSlice.name]: refetchSlice.reducer,

  // global error
  [globalMessage.name]: globalMessage.reducer,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      // .concat(productsApi.middleware)
      .concat(cartApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(userAPI.middleware)
      .concat(authApi.middleware)
      .concat(addressApi.middleware)
      .concat(categoryApi.middleware)
      .concat(centerAddressApi.middleware),
});

// store.subscribe(() => {
//   console.log("State after change:", store.getState().mapSelectedAddress);
// });

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
