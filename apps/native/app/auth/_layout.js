import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          title: "OTP verfication",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerShown: false,
          headerBackTitle: false,
          headerBackVisible: false,
          headerLeft: (props) => (
            <Pressable
              onPress={() => {
                if (props.canGoBack) router.dismiss();
              }}
              className="p-2 mr-3 border border-gray-200 rounded-full">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          ),
        }}>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
