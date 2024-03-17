import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: "20",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={23} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} name="shopping-cart" color={color} />
          ),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: "20",
          },
        }}
      />
      <Tabs.Screen
        name="my_orders"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={21} name="shopping-bag" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my_account"
        options={{
          title: "My Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={23} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
