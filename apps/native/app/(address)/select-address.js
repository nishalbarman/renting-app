import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGetAddressQuery } from "@store/rtk";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import AddressCardSkeleton from "../../Skeletons/AddressCardSkeleton";

export default function AddressList() {
  const searchParams = useLocalSearchParams();

  const router = useRouter();

  const { name, mobileNo } = useSelector((state) => state.auth);
  const { productType } = useSelector((state) => state.product_store);

  const [nextScreenClicked, setNextScreenClicked] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    data: address,
    isLoading: isAddressLoading,
    isFetching: isAddressFetching,
    error: addressFetchError,
    // refetch,
  } = useGetAddressQuery();

  useEffect(() => {
    if (address && address.length > 0) {
      setSelectedAddress(address[0]._id);
    }
  }, [address]);

  const handleAddAddressClick = () => {
    router.navigate(`/add-address`);
  };

  const handleContinueClick = useCallback(() => {
    setNextScreenClicked(true);
    if (productType === "buy") {
      router.replace({
        pathname: "checkout-razorpay",
        params: {
          checkoutSingleOrCart: searchParams?.checkoutSingleOrCart,
          checkoutType: "buy",
          address: selectedAddress,

          // these parameters will be available if checkout is for single product/direct buy
          productId: searchParams?.productId,
          filteredVariantId: searchParams?.filteredVariantId,
          quantity: searchParams?.quantity,
        },
      });
    } else {
      router.replace({
        pathname: "select-center",
        params: {
          address: selectedAddress,
        },
      });
    }
  });

  return (
    <SafeAreaView className="bg-white w-full">
      <Stack.Screen
        options={{
          title: "Shipping Address",
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
      />

      <View className="pt-1 items-center w-full">
        {isAddressLoading ? (
          <AddressCardSkeleton />
        ) : (
          <>
            {address && address.length > 0 ? (
              <>
                <View className="px-3 w-full bg-transparent">
                  <Pressable
                    disabled={!selectedAddress}
                    onPress={handleContinueClick}
                    className="rounded-md h-11 mb-3 w-full bg-green-600 bg-black flex items-center justify-center">
                    {nextScreenClicked ? (
                      <ActivityIndicator size={25} color={"white"} />
                    ) : (
                      <Text className="text-white text-lg">Continue</Text>
                    )}
                  </Pressable>
                </View>
                <FlatList
                  className="w-full px-4 h-full"
                  keyExtractor={(item, index) => index.toString()}
                  data={address}
                  ItemSeparatorComponent={() => <View className="my-1"></View>}
                  ListHeaderComponent={() => (
                    <>
                      <TouchableOpacity
                        disabled={!selectedAddress}
                        onPress={handleContinueClick}
                        className="rounded-md h-12 mb-3 w-full bg-black-600 flex items-center justify-center absolute">
                        {nextScreenClicked ? (
                          <ActivityIndicator size={25} color={"white"} />
                        ) : (
                          <Text className="text-white text-lg">Continue</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                  renderItem={({ item }) => (
                    <>
                      <Pressable
                        onPress={() => {
                          setSelectedAddress(item._id);
                        }}
                        style={{
                          position: "relative",
                        }}
                        className={`h-22 bg-light-blue-200 p-4 rounded-md w-full border ${selectedAddress === item._id ? "border-black-600 border-[2px] bg-green-100 bg-white" : "border-gray-300"}`}>
                        <View className="w-full">
                          <Text className="text-black font-medium mb-2 text-sm">
                            {name}
                          </Text>
                          <Text className="text-gray-700 mb-2 text-sm">
                            Full Address:{" "}
                            <Text className="font-bold">
                              {item.prefix}, {item.streetName}, {item.city},{" "}
                              {item.postalCode}, {item.state}, {item.country}
                            </Text>
                          </Text>
                          <Text className="text-gray-700 mb-2 text-sm">
                            Road: {item.streetName}
                          </Text>
                          <Text className="text-gray-700 mb-2 text-sm">
                            City: {item.city}
                          </Text>
                          <Text className="text-gray-700 mb-2 text-sm">
                            State: {item.state}
                          </Text>
                          <Text className="text-gray-700 mb-2 text-sm">
                            PinCode: {item.postalCode}
                          </Text>
                          <Text className="text-gray-700 text-sm">
                            {mobileNo}
                          </Text>
                        </View>
                        {selectedAddress === item._id && (
                          <View className="w-full flex-row justify-end">
                            <View className="border border-[2px] border-black-600 rounded-md p-1">
                              <AntDesign
                                name="check"
                                size={22}
                                color="#514FB6"
                              />
                            </View>
                          </View>
                        )}
                      </Pressable>
                    </>
                  )}
                />
                <View className="h-22 mb-22"></View>
              </>
            ) : (
              <View className="w-full h-full flex-col items-center justify-center px-3">
                <Text className="font-[roboto-mid] text-[18px] text-center">
                  You do not have any address, would you like to add one?
                </Text>
                {(!address || address.length < 5) && (
                  <TouchableOpacity
                    onPress={handleAddAddressClick}
                    className="mt-6 flex items-center justify-center self-center w-[200px] h-[45px] p-[0px_20px] bg-black rounded-lg">
                    <Text className="text-white font-[roboto-bold] text-sm">
                      Add Address
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
