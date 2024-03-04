import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView>
          <Slot />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}
