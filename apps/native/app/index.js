import { useSelector } from "react-redux";
import { Text, View } from "react-native";

import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isFontLoaded] = useFonts({
    mrt: require("../assets/fonts/montserrat/static/Montserrat-Regular.ttf"),
    "mrt-light": require("../assets/fonts/montserrat/static/Montserrat-Light.ttf"),
    "mrt-mid": require("../assets/fonts/montserrat/static/Montserrat-Medium.ttf"),
    "mrt-bold": require("../assets/fonts/montserrat/static/Montserrat-Bold.ttf"),
    "mrt-xbold": require("../assets/fonts/montserrat/static/Montserrat-ExtraBold.ttf"),
  }); // load the fonts

  const userToken = useSelector((state) => state.user.jwtToken);

  const hideSplashScreen = async () => {
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (isFontLoaded) {
      hideSplashScreen();
    }
  }, [isFontLoaded]);

  if (!isFontLoaded) {
    return null;
  }

  if (!userToken) {
    console.log("There is no token");
    return <Redirect href={"/auth/login"} />;
  }

  return <Redirect href={"/(tabs)"} />;
}
