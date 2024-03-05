import { Slot, Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
        {/* <Stack>
          <Stack.Screen
            name="auth/login/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack> */}
      </PersistGate>
    </Provider>
  );
}
