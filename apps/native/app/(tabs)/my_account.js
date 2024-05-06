import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { SheetManager } from "react-native-actions-sheet";
import { useDispatch, useSelector } from "react-redux";
import { clearLoginSession } from "@store/rtk";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountScreen = () => {
  const { name } = useSelector((state) => state.auth);

  const handleAddressSheetOpen = useCallback(() => {
    SheetManager.show("address-list-sheet");
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearLoginSession());
    AsyncStorage.clear();
    router.dismissAll();
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className={`flex-1`}>
      <ScrollView className="bg-white">
        <View className="px-4 py-2">
          <View className="flex h-14 flex-row items-center justify-between bg-yellow-200 p-3 rounded-md mb-4">
            <Text className="font-semibold">Hello! {name}</Text>
          </View>

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

            {/* <TouchableOpacity
              onPress={handleAddressSheetOpen}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md">Become a Center</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity> */}

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
