import { useSelector } from "react-redux";
import { SafeAreaView, View } from "react-native";

import { Redirect } from "expo-router";
import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AnimateSpin from "../components/AnimateSpin/AnimateSpin";
import { EvilIcons } from "@expo/vector-icons";

import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import handleGlobalError from "../lib/handleError";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isFontLoaded, error] = useFonts({
    roboto: require("../assets/fonts/Roboto/Roboto-Regular.ttf"),
    "roboto-black": require("../assets/fonts/Roboto/Roboto-Black.ttf"),
    "roboto-italic": require("../assets/fonts/Roboto/Roboto-Italic.ttf"),
    "roboto-thin": require("../assets/fonts/Roboto/Roboto-Thin.ttf"),
    "roboto-light": require("../assets/fonts/Roboto/Roboto-Light.ttf"),
    "roboto-mid": require("../assets/fonts/Roboto/Roboto-Medium.ttf"),
    "roboto-bold": require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
    "roboto-xbold": require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
  }); // load the fonts

  const userToken = useSelector((state) => state.auth.jwtToken);

  const hideSplashScreen = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (isFontLoaded) {
      hideSplashScreen();
    }
  }, [isFontLoaded]);

  const saveTokenToDatabase = async (token, userToken) => {
    try {
      const respo = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/firebase/save-messaging-token`,
        {
          firebaseMessagingToken: token,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Firebase Messaging Token Failed -->", error);
      handleGlobalError(error);
    }
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("Authorization status:", authStatus);

          messaging()
            .getToken()
            .then((token) => {
              return saveTokenToDatabase(token, userToken);
            });

          // Listen to whether the token changes
          return messaging().onTokenRefresh((token) => {
            saveTokenToDatabase(token, userToken);
          });
        }
      } catch (error) {
        console.log("index.js --> Firebase error-->", error);
        // handleGlobalError(error);
      }
    };

    requestUserPermission();
  }, []);

  if (!isFontLoaded) {
    return (
      <SafeAreaView>
        <View className="flex-1 items-center">
          <AnimateSpin>
            <EvilIcons name="spinner" size={50} color="black" />
          </AnimateSpin>
        </View>
      </SafeAreaView>
    );
  }

  if (!userToken) {
    return <Redirect href={"/auth/login"} />;
  }

  // return <Redirect href={"/view?id=663140bc7b100fff4b8c9f69"} />;
  // return <Redirect href={"/order-placed"} />;
  // return <Redirect href={"/order-track"} />;
  // return <Redirect href={"/order-view"} />;
  // return <Redirect href={"/filter-screen"} />;
  return <Redirect href={"/(tabs)"} />;
}
