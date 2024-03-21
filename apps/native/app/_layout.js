import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk/store";
import { PersistGate } from "redux-persist/integration/react";
import { SheetProvider } from "react-native-actions-sheet";
import ToastManager, { Toast } from "expo-react-native-toastify";

import "../sheetManager/sheets";

import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Use imperatively

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SheetProvider>
          <SafeAreaProvider>
            <ToastManager />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SafeAreaProvider>
        </SheetProvider>
      </PersistGate>
    </Provider>
  );
}
