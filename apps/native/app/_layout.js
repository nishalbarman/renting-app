import { Stack, useRouter } from "expo-router";
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
// import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Pressable, Text, View } from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

import "react-native-reanimated";

export default function RootLayout() {
  // useEffect(() => {
  //   const version = AsyncStorage.getItem("version");
  //   console.log(version);
  // }, []);

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
          style={{ borderLeftColor: "pink", margin: "0px 10px" }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 15,
            fontWeight: "400",
            color: "black",
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
        <View
          style={{
            elevation: 2,
          }}
          className="flex-row items-center justify-start px-2 py-3 h-fit border-gray-300 rounded-md bg-white w-[95%] px-2">
          <View className="items-center mr-2">
            <View className="bg-green-500 rounded-full">
              <AntDesign name="checkcircleo" size={25} color="white" />
            </View>
          </View>
          <Text lineBreakMode="tail" className="text-sm text-black text-wrap">
            {text1}
          </Text>
        </View>
      ),
      err: ({ text1, props }) => (
        <View
          style={{
            elevation: 2,
          }}
          className="flex-row items-center justify-start px-2 py-3 h-fit border-gray-300 rounded-md bg-white w-[95%] px-2">
          <View className="items-center mr-2">
            <View className="bg-red-500 rounded-full">
              <Entypo name="circle-with-cross" size={25} color="white" />
            </View>
          </View>
          <Text lineBreakMode="tail" className="text-sm text-black text-wrap">
            {text1}
          </Text>
        </View>
      ),
    };
  }, []);

  const router = useRouter();

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
            merchantIdentifier="com.crafter.shop">
            <SheetProvider>
              <SafeAreaProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    headerBackTitle: false,
                    headerBackVisible: false,
                    headerLeft: (props) => (
                      <Pressable
                        onPress={() => {
                          if (props.canGoBack) router.dismiss();
                        }}
                        className="p-2 mr-3 border border-gray-200 rounded-full">
                        <Ionicons name="chevron-back" size={24} color="black" />
                      </Pressable>
                    ),
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
