import React from "react";
import { Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarIcon: ({ color }) => (
          <FontAwesome size={23} name="home" color={color} />
        ),
      }}
    />
  );
}

export default Layout;
