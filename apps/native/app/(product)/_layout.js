import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function App() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
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
      <Stack.Screen name="view" />
      <Stack.Screen name="list" />
    </Stack>
  );
}
