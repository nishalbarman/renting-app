import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { useGetAddressQuery } from "@store/rtk/apis/addressApi";

export default function AddressList() {
  const handlers = useScrollHandlers();

  const handleAddAddressClick = () => {
    SheetManager.show("add-address-sheet");
  };

  const {
    data: address,
    isLoading: isAddressLoading,
    isFetching: isAddressFetching,
    error: addressFetchError,
  } = useGetAddressQuery();

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-center pb-10">
            <Text className="font-[poppins-bold] text-[15px]">
              Your addresses
            </Text>

            <View className="pl-10 pr-10 pt-1 gap-y-4 justify-center mt-1">
              {address &&
                address.length > 0 &&
                address.map((item) => {
                  return (
                    <View key={item._id}>
                      <Text>{Object.values(item).join(", ")}</Text>
                    </View>
                  );
                })}

              {(!address || address.length <= 0) && (
                <Text className="font-[poppins-mid] text-[18px] text-center">
                  No address found
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleAddAddressClick}
              className="mt-6 flex items-center justify-center self-center w-[200px] h-[45px] p-[0px_20px] bg-[#d875ff] rounded-lg">
              <Text className="text-white font-bold">Add Another</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
