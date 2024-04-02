import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import axios from "axios";
import Razorpay from "react-native-customui";
import { useStripe } from "@stripe/stripe-react-native";

export default function AddressList() {
  const router = useRouter();

  const { name, mobileNo, jwtToken } = useSelector((state) => state.auth);
  const { productType } = useSelector((state) => state.product_store);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

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
  }, []);

  const fetchPaymentSheetParams = async () => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/stripe/cart/${productType}`,
      {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Renting App - Nishal",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: name,
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  // const handlePaymentOpen = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.EXPO_PUBLIC_API_URL}/pay/razorpay/create-cart-order/${productType}?address=${selectedAddress}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${jwtToken}`,
  //         },
  //       }
  //     );
  //     const razorpayOrder = response.data.payment;
  //     console.log("Got the response for order creation -->", razorpayOrder);
  //     const options = {
  //       description:
  //         "Online purchase for " +
  //         razorpayOrder.productinfo +
  //         " on renting officical",
  //       image: "https://i.imgur.com/3g7nmJC.jpg",
  //       currency: "INR",
  //       key: process.env.EXPO_RAZORPAY_KEY,
  //       amount: razorpayOrder.amount,
  //       name: razorpayOrder.name,
  //       order_id: razorpayOrder.razorpayOrderId, //Replace this with an order_id created using Orders API.
  //       prefill: {
  //         email: razorpayOrder.email,
  //         contact: razorpayOrder.mobileNo,
  //         name: razorpayOrder.name,
  //       },
  //       theme: { color: "#53a20e" },
  //     };

  //     Razorpay.open(options)
  //       .then((data) => {
  //         // handle success
  //         alert(`Success: ${data.razorpay_payment_id}`);
  //       })
  //       .catch((error) => {
  //         // handle failure
  //         alert(`Error: ${error.code} | ${error.description}`);
  //       });
  //   } catch (error) {
  //     console.error("Cart Error Razor Pay Payment", error);
  //   }
  // };

  return (
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          title: "Select Address",
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <View className="px-4 py-1 pb-3">
        <TouchableOpacity
          onPress={openPaymentSheet}
          className="rounded-md h-12 w-full bg-dark-purple flex items-center justify-center">
          <Text className="text-white text-lg">Continue</Text>
        </TouchableOpacity>
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
                                  top: -35,
                                  left: "50%",
                                  transform: "translate(-15px)",
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
                        {/* <View className="w-full flex items-end">
                            {isAddressDeleteLoading ? (
                              <>
                                <ActivityIndicator
                                  size={15}
                                  color={"dark-purple"}
                                />
                              </>
                            ) : (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    handleDeleteAddress(item._id);
                                  }}
                                  className="flex items-center justify-center flex-0 p-1 rounded-full bg-dark-purple w-10 h-10 mt-4">
                                  <MaterialIcons
                                    name="delete"
                                    size={24}
                                    color="white"
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          </View> */}
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
    </SafeAreaView>
  );
}
