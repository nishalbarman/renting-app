import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { useGetAddressQuery } from "@store/rtk/apis/addressApi";

import { useRouter } from "expo-router";

import { useSelector } from "react-redux";

export default function AddressList() {
  const handlers = useScrollHandlers();

  const { name, mobileNo } = useSelector((state) => state.auth);

  console.log(mobileNo);

  const router = useRouter();
  const handleAddAddressClick = () => {
    router.push(`/add-address`);
    SheetManager.hide("address-list-sheet");
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

            <View className="pt-2 px-1 justify-center mt-1">
              {address &&
                address.length > 0 &&
                address.map((item) => {
                  return (
                    <>
                      <View
                        key={item._id}
                        className="bg-light-blue-200 p-4 rounded-md shadow-sm mb-3 w-[full]">
                        <Text className="text-black font-medium mb-2">
                          {name}
                        </Text>
                        <Text className="text-gray-700 mb-2">
                          {item.name}, {item.locality}, {item.streetName},{" "}
                          {item.postalCode}, {item.country}
                        </Text>
                        <Text className="text-gray-700">{mobileNo}</Text>
                      </View>
                      {/* <View key={item._id}>
                      <Text>{Object.values(item).join(", ")}</Text>
                    </View> */}
                    </>
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
