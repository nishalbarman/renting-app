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
import { useSelector } from "react-redux";

const AccountScreen = () => {
  const { name } = useSelector((state) => state.auth);

  const handleAddressSheetOpen = useCallback(() => {
    SheetManager.show("address-list-sheet");
  }, []);

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <ScrollView className="bg-white">
        <View className="px-4">
          <View className="flex flex-row items-center justify-between bg-yellow-200 p-3 rounded-md mb-4">
            <Text className="font-semibold">Hey! {name}</Text>
            {/* <View
              className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-white"
              style={styles.customBadge}>
              <Text>813</Text>
            </View> */}
          </View>

          {/* GRID LAYOUT FOUR ITEMS */}
          {/* <View className="flex flex-wrap flex-row justify-center">
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
            <FontAwesome name="heart" size={24} color="gray" className="mb-2" />
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
            {/* <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4 mb-2">
            <Text>Flipkart Plus</Text>
            <Feather name="chevron-right" size={24} color="currentColor" />
          </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                SheetManager.show("update-profile");
              }}
              className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4 mb-2">
              <Text>Edit Profile</Text>
              <Feather name="chevron-right" size={24} color="currentColor" />
            </TouchableOpacity>
            {/* <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4 mb-2">
            <Text>Saved Cards & Wallet</Text>
            <Feather name="chevron-right" size={24} color="currentColor" />
          </TouchableOpacity> */}
            <TouchableOpacity
              onPress={handleAddressSheetOpen}
              className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4 mb-2">
              <Text>Saved Addresses</Text>
              <Feather name="chevron-right" size={24} color="currentColor" />
            </TouchableOpacity>
            {/* <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4 mb-2">
            <Text>Select Language</Text>
            <Feather name="chevron-right" size={24} color="currentColor" />
          </TouchableOpacity> */}
            {/* <TouchableOpacity className="rounded-lg shadow-sm bg-card text-card-foreground shadow-sm flex justify-between flex-row items-center p-4">
            <Text>Notification Settings</Text>
            <Feather name="chevron-right" size={24} color="currentColor" />
          </TouchableOpacity> */}
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
