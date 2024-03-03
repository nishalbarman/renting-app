import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@store/rtk";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaView>
        <Slot />
      </SafeAreaView>
    </Provider>
  );
}
