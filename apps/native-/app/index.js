import { Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isLoaded] = useFonts({
    mrt: require("../assets/fonts/montserrat/static/Montserrat-Black.ttf"),
    "mrt-mid": require("../assets/fonts/montserrat/static/Montserrat-Medium.ttf"),
    "mrt-bold": require("../assets/fonts/montserrat/static/Montserrat-Bold.ttf"),
    "mrt-xbold": require("../assets/fonts/montserrat/static/Montserrat-ExtraBold.ttf"),
  }); // load the fonts

  const [isAppReady, setIsAppReady] = useState(false);

  const handleOnLayout = useCallback(async () => {
    if (!!isLoaded && !!isAppReady) {
      await SplashScreen.hideAsync(); //hide the splashscreen
    }
  }, [isLoaded]);

  const retrieveUserDetails = () => {
    SecureStore.
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <View
      onLayout={handleOnLayout}
      className="h-[100%] flex flex-col items-center justify-center">
      <View>
        <Image
          className="w-[200px] h-[200px] object-scale rounded-3xl"
          source={require("../assets/illustrations/user_on_bike.png")}
        />
      </View>
    </View>
  );
}
