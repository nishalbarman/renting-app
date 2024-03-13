import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./apis/userApi";
import { authSlice } from "./slices/authSlice";
import { authApi } from "./apis/authApi";

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

const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
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
      .concat(wishlistApi.middleware)
      .concat(userAPI.middleware)
      .concat(authApi.middleware),
});

// store.subscribe(() => {
//   console.log("State after change:", store.getState().wishlistApi);
// });

export const persistor = persistStore(store);

setupListeners(store.dispatch);
