import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk/store";
import { PersistGate } from "redux-persist/integration/react";
import { SheetProvider } from "react-native-actions-sheet";
import ToastManager, { Toast } from "expo-react-native-toastify";

import "../sheetManager/sheets";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use imperatively

export default function RootLayout() {
  useEffect(() => {
    const version = AsyncStorage.getItem("version");
    console.log(version);
  });

  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      'url',
      (event) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          urlScheme={
            Constants.appOwnership === "expo"
              ? Linking.createURL("/--/")
              : Linking.createURL("")
          }>
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
      </PersistGate>
    </Provider>
  );
}
