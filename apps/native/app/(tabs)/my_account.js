import React, { memo, useCallback, useState, useTransition } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { SheetManager } from "react-native-actions-sheet";
import { useDispatch, useSelector } from "react-redux";
import { clearLoginSession, setProductType } from "@store/rtk";
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

  const [isLoading, startTransition] = useTransition();

  const { productType } = useSelector((state) => state.product_store);

  const [locProductType, setProductLocType] = useState(productType);

  const handleChangeProductType = (type) => {
    setProductLocType(type);
    startTransition(() => {
      dispatch(setProductType(type));
    });
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

          <View className="mt-2">
            <Text className="font-semibold text-lg mb-1">Product Mode</Text>

            <View className="w-full flex-row">
              <View className="flex flex-row h-9 p-1 rounded-md w-[40%] w-full bg-white border border-green-700 mt-1">
                <Pressable
                  onPress={() => {
                    handleChangeProductType("rent");
                  }}
                  className={`${locProductType === "rent" && "bg-green-600 text-white"} rounded-md w-[50%] flex items-center justify-center`}>
                  <Text
                    className={`font-[poppins-bold] tracking-wide ${locProductType !== "rent" ? "text-green-800" : "text-white"}`}>
                    Rent
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleChangeProductType("buy");
                  }}
                  className={`${locProductType === "buy" && "bg-green-600 text-white"} rounded-md w-[50%] bg-none flex items-center justify-center`}>
                  <Text
                    className={`font-[poppins-bold] tracking-wide ${locProductType === "rent" ? "text-green-800" : "text-white"}`}>
                    Purchase
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(AccountScreen);
