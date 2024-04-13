import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";

import { SheetManager } from "react-native-actions-sheet";
import { useDispatch, useSelector } from "react-redux";
import { clearLoginSession } from "@store/rtk/slices/authSlice";
import { useRouter } from "expo-router";

const AccountScreen = () => {
  const { name } = useSelector((state) => state.auth);

  const handleAddressSheetOpen = useCallback(() => {
    SheetManager.show("address-list-sheet");
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearLoginSession());
    router.dismissAll();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className={`flex-1`}>
      <ScrollView className="bg-white">
        <View className="px-4 py-2">
          <View className="flex h-14 flex-row items-center justify-between bg-yellow-200 p-3 rounded-md mb-4">
            <Text className="font-semibold">Hello! {name}</Text>
            {/* <View
              className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-white"
              style={styles.customBadge}>
              <Text>813</Text>
            </View> */}
          </View>

          {/* GRID LAYOUT FOUR ITEMS */}
          {/* <View className="flex flex-wrap flex-row justify-center mb-4">
            <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-4 flex-grow">
              <FontAwesome
                name="envelope"
                size={24}
                color="gray"
                className="mb-2"
              />
              <Text className="mt-2">Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-4">
              <FontAwesome
                name="heart"
                size={24}
                color="gray"
                className="mb-2"
              />
              <Text className="mt-2">Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-4">
              <FontAwesome name="tag" size={24} color="gray" className="mb-2" />
              <Text className="mt-2">Coupons</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-4">
              <FontAwesome
                name="question-circle"
                size={24}
                color="gray"
                className="mb-2"
              />
              <Text className="mt-2">Help Center</Text>
            </TouchableOpacity>
          </View> */}

          <View className="mt-1">
            <Text className="font-semibold text-lg mb-2">Account Settings</Text>

            <TouchableOpacity
              onPress={() => {
                SheetManager.show("update-profile");
              }}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md">Edit Profile</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddressSheetOpen}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md">Saved Addresses</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddressSheetOpen}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md">Become a Center</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md">Logout</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customBadge: {
    width: "auto",
  },
  bottomNavIcon: {
    color: "#6b7280",
  },
});

export default memo(AccountScreen);
