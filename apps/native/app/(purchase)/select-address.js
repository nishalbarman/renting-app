import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGetAddressQuery } from "@store/rtk/apis/addressApi";

import { Stack, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import AddressCardSkeleton from "../../Skeletons/AddressCardSkeleton";
import PlaceOrderModal from "../../modal/Cart/PlaceRentOrderModal";

export default function AddressList() {
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

  const handleContinueClick = useCallback(() => {
    setNextScreenClicked(true);
    if (productType === "buy") {
      router.replace({
        pathname: "checkout",
        params: {
          address: selectedAddress,
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
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          title: "Select Your Address",
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <View className="px-4 pt-3 ">
        <Pressable
          disabled={!selectedAddress}
          onPress={handleContinueClick}
          className="rounded-md h-12 w-full bg-dark-purple flex items-center justify-center">
          {nextScreenClicked ? (
            <ActivityIndicator size={25} color={"white"} />
          ) : (
            <Text className="text-white text-lg">Continue</Text>
          )}
        </Pressable>
      </View>
      <ScrollView className="bg-white">
        <View className="pt-6 px-4 flex flex-col items-center w-[100%] min-h-screen">
          {isAddressLoading ? (
            <AddressCardSkeleton />
          ) : (
            <>
              {address &&
                address.length > 0 &&
                address.map((item) => {
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedAddress(item._id);
                        }}
                        style={{
                          position: "relative",
                        }}
                        key={item._id}
                        className={`bg-light-blue-200 p-4 rounded-md mb-3 w-[100%] border ${selectedAddress === item._id ? "border-dark-purple border-[2px]" : "border-gray-300"}`}>
                        <View>
                          {selectedAddress === item._id && (
                            <>
                              <View
                                style={{
                                  position: "absolute",
                                  bottom: -10,
                                  right: -8,
                                  backgroundColor: "white",
                                }}
                                className="border border-[2px] border-dark-purple  rounded-md p-1">
                                <AntDesign
                                  name="check"
                                  size={22}
                                  color="#514FB6"
                                />
                              </View>
                            </>
                          )}

                          <Text className="text-black font-medium mb-2">
                            {name}
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            {item.name}, {item.locality}, {item.streetName},{" "}
                            {item.postalCode}, {item.country}
                          </Text>
                          <Text className="text-gray-700">{mobileNo}</Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  );
                })}

              {(!address || address.length <= 0) && (
                <>
                  <Text className="font-[poppins-mid] text-[18px] text-center">
                    No address found
                  </Text>
                  {(!address || address.length < 5) && (
                    <TouchableOpacity
                      //   onPress={handleAddAddressClick}
                      className="mt-6 flex items-center justify-center self-center w-[200px] h-[45px] p-[0px_20px] bg-dark-purple rounded-lg">
                      <Text className="text-white font-bold">Add One</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
      {/* {paymentLoading ||
        (isModalVisible && (
          <PlaceOrderModal
            modalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            orderPlaceStatus={orderStatus}
            errorMsg={orderError?.message}
          />
        ))} */}
    </SafeAreaView>
  );
}
