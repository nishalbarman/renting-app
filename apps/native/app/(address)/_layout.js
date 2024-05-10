import React from "react";
import { Stack, useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

function Layout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
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
      }}
    />
  );
}

export default Layout;
