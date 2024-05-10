import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

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
          marginTop: 3,
        },

        headerTitleAlign: "center",
        // tabBarActiveTintColor: "#e0570d",
        tabBarActiveTintColor: "green",

        // tabBarActiveBackgroundColor: "white",

        tabBarItemStyle: {
          borderRadius: 22,
        },

        tabBarStyle: {
          overflow: "hidden",
          // position: "absolute",
          height: 70,
          borderWidth: 1,
          // borderRadius: 25,
          borderColor: "transparent",
          borderTopColor: "transparent",
          // backgroundColor: "rgba(255,254,254,0.95)",
          // backgroundColor: "rgba(0,0,0,0.9)",

          // marginBottom: 10,
          // marginLeft: 5,
          // marginRight: 5,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 5,
          paddingRight: 5,
        },

        tabBarIconStyle: {
          marginBottom: -5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 10,
          // display: "none",
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
      {/* <Tabs.Screen
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
      /> */}
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
