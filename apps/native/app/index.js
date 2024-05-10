import { useSelector } from "react-redux";
import { SafeAreaView, View } from "react-native";

import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AnimateSpin from "../components/AnimateSpin/AnimateSpin";
import { EvilIcons } from "@expo/vector-icons";

import messaging from "@react-native-firebase/messaging";
import axios from "axios";
import handleGlobalError from "../lib/handleError";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isFontLoaded] = useFonts({
    mrt: require("../assets/fonts/montserrat/static/Montserrat-Regular.ttf"),
    "mrt-light": require("../assets/fonts/montserrat/static/Montserrat-Light.ttf"),
    "mrt-mid": require("../assets/fonts/montserrat/static/Montserrat-Medium.ttf"),
    "mrt-bold": require("../assets/fonts/montserrat/static/Montserrat-Bold.ttf"),
    "mrt-xbold": require("../assets/fonts/montserrat/static/Montserrat-ExtraBold.ttf"),
    // poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    // "poppins-light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    // "poppins-mid": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    // "poppins-bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    // "poppins-xbold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    poppins: require("../assets/fonts/Roboto/Roboto-Regular.ttf"),
    "poppins-light": require("../assets/fonts/Roboto/Roboto-Light.ttf"),
    "poppins-mid": require("../assets/fonts/Roboto/Roboto-Medium.ttf"),
    "poppins-bold": require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
    "poppins-xbold": require("../assets/fonts/Roboto/Roboto-Bold.ttf"),
  }); // load the fonts

  const userToken = useSelector((state) => state.auth.jwtToken);

  const hideSplashScreen = async () => {
    await SplashScreen.hideAsync();
  };

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

  // useEffect(() => {
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log("Authorization status:", authStatus);

  //       messaging()
  //         .getToken()
  //         .then((token) => {
  //           return saveTokenToDatabase(token, userToken);
  //         });

  //       // Listen to whether the token changes
  //       return messaging().onTokenRefresh((token) => {
  //         saveTokenToDatabase(token, userToken);
  //       });
  //     }
  //   };
  //   requestUserPermission();
  // }, []);

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
