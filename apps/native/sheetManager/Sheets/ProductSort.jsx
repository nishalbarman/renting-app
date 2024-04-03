import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import {
  useDeleteAddressMutation,
  useGetAddressQuery,
} from "@store/rtk/apis/addressApi";

import { useRouter } from "expo-router";

import { useSelector } from "react-redux";
import AddressCardSkeleton from "../../Skeletons/AddressCardSkeleton";

import { MaterialIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function ProductSort() {
  const handlers = useScrollHandlers();

  const { name, mobileNo } = useSelector((state) => state.auth);

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
    refetch,
  } = useGetAddressQuery();

  console.log(address);

  const [deleteOneAddress, { isLoading: isAddressDeleteLoading }] =
    useDeleteAddressMutation();

  const handleDeleteAddress = async (id) => {
    console.log(id);
    try {
      const response = await deleteOneAddress(id).unwrap();

      console.log("Address Deleted");
    } catch (error) {
      console.error(error);
    } finally {
      refetch();
    }
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-center pb-10">
            <Text className="font-[poppins-bold] text-[14px]">SORT BY</Text>

            <View className="w-full px-4">
              {isAddressLoading ? (
                <AddressCardSkeleton />
              ) : (
                <>
                  <View className="flex-row justify-between mt-3">
                    <Text className="font-bold text-[14px]">Popularity</Text>
                    <BouncyCheckbox
                      size={15}
                      fillColor="#6C63FF"
                      unfillColor="#FFFFFF"
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{ fontFamily: "mrt" }}
                      onPress={(isChecked) => {}}
                    />
                  </View>
                  <View className="flex-row justify-between mt-3">
                    <Text className="font-bold text-[14px]">
                      Price -- Low to High
                    </Text>
                    <BouncyCheckbox
                      size={15}
                      fillColor="#6C63FF"
                      unfillColor="#FFFFFF"
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{ fontFamily: "mrt" }}
                      onPress={(isChecked) => {}}
                    />
                  </View>
                  <View className="flex-row justify-between mt-3">
                    <Text className="font-bold text-[14px]">
                      Price -- High to Low
                    </Text>
                    <BouncyCheckbox
                      size={15}
                      fillColor="#6C63FF"
                      unfillColor="#FFFFFF"
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{ fontFamily: "mrt" }}
                      onPress={(isChecked) => {}}
                    />
                  </View>
                  <View className="flex-row justify-between mt-3">
                    <Text className="font-bold text-[14px]">Newest First</Text>
                    <BouncyCheckbox
                      size={15}
                      fillColor="#6C63FF"
                      unfillColor="#FFFFFF"
                      iconStyle={{ borderColor: "red" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{ fontFamily: "mrt" }}
                      onPress={(isChecked) => {}}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
