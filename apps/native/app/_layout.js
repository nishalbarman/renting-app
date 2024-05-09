import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk";
import { PersistGate } from "redux-persist/integration/react";
import { SheetProvider } from "react-native-actions-sheet";

import "../sheetManager/sheets";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { useCallback, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Text, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function RootLayout() {
  useEffect(() => {
    const version = AsyncStorage.getItem("version");
    console.log(version);
  }, []);

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

    const deepLinkListener = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  const toastConfig = useMemo(() => {
    return {
      /*
        Overwrite 'success' type,
        by modifying the existing `BaseToast` component
      */
      success: (props) => (
        <BaseToast
          {...props}
          style={{ borderLeftColor: "pink" }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 15,
            fontWeight: "400",
          }}
        />
      ),
      /*
        Overwrite 'error' type,
        by modifying the existing `ErrorToast` component
      */
      error: (props) => (
        <ErrorToast
          {...props}
          text1Style={{
            fontSize: 17,
          }}
          text2Style={{
            fontSize: 15,
          }}
        />
      ),
      /*
        Or create a completely new type - `tomatoToast`,
        building the layout from scratch.
    
        I can consume any custom `props` I want.
        They will be passed when calling the `show` method (see below)
      */
      sc: ({ text1, props }) => (
        <View className="flex-row items-center justify-start px-2 py-2 h-fit border border-gray-300 rounded-md bg-white">
          <View className="items-center mr-2">
            <View className="bg-green-500 rounded-full">
              <AntDesign name="checkcircleo" size={25} color="white" />
            </View>
          </View>
          <Text>{text1}</Text>
        </View>
      ),
      err: ({ text1, props }) => (
        <View className="flex-row items-center justify-start px-2 py-2 h-fit border border-gray-300 rounded-md bg-white">
          <View className="items-center mr-2">
            <View className="bg-red-500 rounded-full">
              <Entypo name="circle-with-cross" size={25} color="white" />
            </View>
          </View>
          <Text>{text1}</Text>
        </View>
      ),
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            urlScheme={
              Constants.appOwnership === "expo"
                ? Linking.createURL("/--/")
                : Linking.createURL("")
            }
            merchantIdentifier="merchant.com.Savero">
            <SheetProvider>
              <SafeAreaProvider>
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
      <Toast config={toastConfig} />
    </>
  );
}
