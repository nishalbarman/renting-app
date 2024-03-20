import { useSelector } from "react-redux";
import { SafeAreaView, View } from "react-native";

import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AnimateSpin from "../components/AnimateSpin/AnimateSpin";
import { EvilIcons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync(); // disable auto hide of splash screen

export default function Page() {
  const [isFontLoaded] = useFonts({
    mrt: require("../assets/fonts/montserrat/static/Montserrat-Regular.ttf"),
    "mrt-light": require("../assets/fonts/montserrat/static/Montserrat-Light.ttf"),
    "mrt-mid": require("../assets/fonts/montserrat/static/Montserrat-Medium.ttf"),
    "mrt-bold": require("../assets/fonts/montserrat/static/Montserrat-Bold.ttf"),
    "mrt-xbold": require("../assets/fonts/montserrat/static/Montserrat-ExtraBold.ttf"),
    poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "poppins-light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "poppins-mid": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "poppins-bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "poppins-xbold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
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

  // return <Redirect href={"/product"} />;
  return <Redirect href={"/(tabs)"} />;
}
