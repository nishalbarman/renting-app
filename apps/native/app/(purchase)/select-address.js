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

  const handleAddAddressClick = () => {
    router.push(`/add-address`);
  };

  const handleContinueClick = useCallback(() => {
    setNextScreenClicked(true);
    if (productType === "buy") {
      router.replace({
        pathname: "checkout",
        params: {
          checkoutType: "buy",
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
    <SafeAreaView className="bg-white px-2 w-full">
      <Stack.Screen
        options={{
          title: "Select Your Address",
          headerShown: true,
          headerShadowVisible: false,
        }}
      />

      <View className="pt-1 items-center w-full min-h-screen">
        {isAddressLoading ? (
          <AddressCardSkeleton />
        ) : (
          <>
            {address && address.length > 0 ? (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={address}
                ItemSeparatorComponent={() => <View className="my-1"></View>}
                ListHeaderComponent={() => (
                  <>
                    <TouchableOpacity
                      disabled={!selectedAddress}
                      onPress={handleContinueClick}
                      className="rounded-md h-12 mb-3 w-full bg-green-600 flex items-center justify-center ">
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
                      className={`bg-light-blue-200 p-2 rounded-md w-full border ${selectedAddress === item._id ? "border-green-600 border-[2px]" : "border-gray-300"}`}>
                      <View>
                        {selectedAddress === item._id && (
                          <>
                            <View
                              style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: "white",
                              }}
                              className="border border-[2px] border-green-600 rounded-md p-1">
                              <AntDesign
                                name="check"
                                size={22}
                                color="#514FB6"
                              />
                            </View>
                          </>
                        )}

                        <View className="w-full">
                          <Text className="text-black font-medium mb-2">
                            {name}
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            Full Address:{" "}
                            <Text className="font-bold">
                              {item.prefix}, {item.streetName}, {item.city},{" "}
                              {item.postalCode}, {item.state}, {item.country}
                            </Text>
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            Road: {item.streetName}
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            City: {item.city}
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            State: {item.state}
                          </Text>
                          <Text className="text-gray-700 mb-2">
                            PinCode: {item.postalCode}
                          </Text>
                          <Text className="text-gray-700">{mobileNo}</Text>
                        </View>
                      </View>
                    </Pressable>
                  </>
                )}
              />
            ) : (
              <View className="w-full h-full flex-col items-center justify-center">
                <Text className="font-[poppins-mid] text-[18px] text-center">
                  No address found
                </Text>
                {(!address || address.length < 5) && (
                  <TouchableOpacity
                    onPress={handleAddAddressClick}
                    className="mt-6 flex items-center justify-center self-center w-[200px] h-[45px] p-[0px_20px] bg-dark-purple rounded-lg">
                    <Text className="text-white font-bold">Add One</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </View>

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
