import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },

        tabBarActiveTintColor: "green",
        tabBarStyle: {
          height: 70,
          borderWidth: 1,
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
          borderRadius: 20,
          borderColor: "transparent",
          borderTopColor: "transparent",
          marginBottom: 10,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 10,
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
            fontSize: 20,
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
