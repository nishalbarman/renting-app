import { Slot, Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "@store/rtk/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { PersistGate } from "redux-persist/integration/react";
import { SheetProvider } from "react-native-actions-sheet";
import "../sheetManager/sheets";
import ToastManager, { Toast } from "expo-react-native-toastify";

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
