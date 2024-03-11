import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
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
        }}
      />
      <Tabs.Screen
        name="my_orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={21} name="shopping-bag" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my_account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={23} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
