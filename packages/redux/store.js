import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userApi";
import { authSlice } from "./slices/authSlice";
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
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { wishlistApi } from "./apis/wishlistApi";
import { productsApi } from "./apis/productApi";
import { categoryApi } from "./apis/categoryApi";
import { storeTypeSlice } from "./slices/storeTypeSlice";
import { cartApi } from "./apis/cartApi";

const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [addressSlice.name]: addressSlice.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [storeTypeSlice.reducerPath]: storeTypeSlice.reducer,
});

const persistConfig = {
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
      .concat(productsApi.middleware)
      .concat(cartApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(userAPI.middleware)
      .concat(authApi.middleware)
      .concat(addressApi.middleware)
      .concat(categoryApi.middleware),
});

// store.subscribe(() => {
//   console.log("State after change:", store.getState().mapSelectedAddress);
// });

export const persistor = persistStore(store);

setupListeners(store.dispatch);
