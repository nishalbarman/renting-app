import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk/store";
import { PersistGate } from "redux-persist/integration/react";
import { SheetProvider } from "react-native-actions-sheet";
import ToastManager, { Toast } from "expo-react-native-toastify";

import "../sheetManager/sheets";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";

// Use imperatively

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <StripeProvider
        publishableKey={process.env.EXPO_STRIPE_PUBLISHABLE_KEY}
        urlScheme="native" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
      >
        <SheetProvider>
          <SafeAreaProvider>
            <ToastManager />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SafeAreaProvider>
        </SheetProvider>
      </StripeProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}
