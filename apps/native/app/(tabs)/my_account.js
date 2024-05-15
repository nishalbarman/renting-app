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
            <Text className="font-semibold text-black text-sm">Hello! {name}</Text>
          </View>

          <View className="mt-1">
            <Text className="font-semibold text-lg mb-2">Account Settings</Text>

            <TouchableOpacity
              onPress={() => {
                SheetManager.show("update-profile");
              }}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md text-black text-sm">Edit Profile</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddressSheetOpen}
              className="rounded-lg border border-gray-300 shadow-sm bg-white flex justify-between flex-row items-center px-4 h-14 mb-2">
              <Text className="text-md text-black text-sm">Saved Addresses</Text>
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
              <Text className="text-md text-black text-sm">Logout</Text>
              <Feather name="chevron-right" size={24} color="#787878" />
            </TouchableOpacity>
          </View>

          <View className="mt-2">
            <Text className="font-semibold text-lg mb-1 text-black">Product Mode</Text>

            <View className="w-full flex-row">
              <View className="flex flex-row h-11 rounded-md w-[40%] w-full bg-gray-100 mt-1 overflow-hidden">
                {/* border-green-700  */}
                <Pressable
                  onPress={() => {
                    handleChangeProductType("rent");
                  }}
                  style={
                    locProductType === "rent"
                      ? {
                          elevation: 3,
                        }
                      : {}
                  }
                  className={`${locProductType === "rent" && "bg-black text-white rounded-r-full"} w-[50%] flex items-center justify-center`}>
                  {/* bg-black-600, text-black-800*/}
                  <Text
                    className={`font-[roboto-bold] tracking-wide ${locProductType !== "rent" ? "text-black" : "text-white"}`}>
                    Rent
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleChangeProductType("buy");
                  }}
                  style={
                    locProductType === "buy"
                      ? {
                          elevation: 3,
                        }
                      : {}
                  }
                  className={`${locProductType === "buy" && "bg-black text-white rounded-l-full"} w-[50%] bg-none flex items-center justify-center`}>
                  {/* bg-black-600, text-black-800*/}
                  <Text
                    className={`font-[roboto-bold] tracking-wide ${locProductType === "rent" ? "text-black" : "text-white"}`}>
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
