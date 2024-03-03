import { useSelector } from "react-redux";
import { Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isFontLoaded] = useFonts({
    mrt: require("../assets/fonts/montserrat/static/Montserrat-Black.ttf"),
    "mrt-mid": require("../assets/fonts/montserrat/static/Montserrat-Medium.ttf"),
    "mrt-bold": require("../assets/fonts/montserrat/static/Montserrat-Bold.ttf"),
    "mrt-xbold": require("../assets/fonts/montserrat/static/Montserrat-ExtraBold.ttf"),
  }); // load the fonts

  const [isAppReady, setIsAppReady] = useState(true);

  const userToken = useSelector((state) => state.user.jwtToken) || null;

  const handleOnLayout = useCallback(async () => {
    if (!!isFontLoaded && !!isAppReady) {
      await SplashScreen.hideAsync(); //hide the splashscreen
    }
  }, [isLoaded]);

  const retrieveUserDetails = () => {
    SecureStore.getItemAsync();
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <View onLayout={handleOnLayout}>
      {!!userToken ? (
        <Redirect href={"/dashboard"} />
      ) : (
        <Redirect href={"/auth/login"} />
      )}
    </View>
  );
}
