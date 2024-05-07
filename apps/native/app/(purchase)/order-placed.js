import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import axios from "axios";

const OrderResult = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [isLoading, setIsLoading] = useState(true);

  const [orderDetails, setOrderDetails] = useState(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/view/${params.paymentTransactionId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const orderDetails = response.data.orderDetails;

      console.log(response.data);

      setOrderDetails(orderDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [params.paymentTransactionId]);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center">
        <View className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
          <View className="items-center mb-4">
            <View className="bg-green-500 rounded-full p-2">
              <AntDesign name="checkcircleo" size={60} color="white" />
            </View>
          </View>
          <Text className="">#{orderDetails?.order[0]?.orderGroupID}</Text>
          <Text className="text-2xl font-semibold text-gray-800">Success</Text>
          <Text className="text-gray-600">
            You're Successfully Placed Order.
          </Text>
          <View className="bg-green-100 text-green-700 py-2 px-4 rounded-lg my-4 text-3xl font-semibold">
            <Text>Rs. {orderDetails?.order[0]?.totalPrice}</Text>
          </View>
          <Text className="text-gray-500">Request Amount</Text>
          <View className="mt-6">
            <View className="flex-row justify-between items-center text-gray-700">
              <Text>Order ID</Text>
              <Text className="font-semibold">
                #{orderDetails?.order[0]?.orderGroupID}
              </Text>
            </View>
            <View className="flex-row justify-between items-center text-gray-700">
              <Text>Txn ID</Text>
              <Text className="font-semibold">
                {orderDetails?.order[0]?.paymentTxnId}
              </Text>
            </View>
            <View className="flex-row justify-between items-center text-gray-700 mt-4">
              <Text>Items</Text>
              {/* <Text className="font-semibold">Lurch Schpellchek</Text> */}
            </View>
            <FlatList
              className="w-full h-fit pb-10 mt-2"
              data={orderDetails?.order}
              renderItem={({ item }) => {
                return (
                  <View className="flex flex-row">
                    <Text>{item?.quantity}pc </Text>
                    <Pressable
                      onPress={() => {
                        router.navigate(`/view?id=${item.product}`);
                      }}>
                      <Text className="text-green-800">{item?.title}</Text>
                    </Pressable>
                  </View>
                );
              }}
            />
            <View className="flex-row justify-between items-center text-gray-700 mt-4">
              <Text>Date:</Text>
              <Text className="font-semibold">
                {new Date(
                  orderDetails?.order[0]?.createdAt
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.replace("/my_orders");
            }}
            className="mt-6 bg-blue-600 py-3 rounded-full">
            <Text className="text-center text-white font-semibold">
              My Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-2">
            <Text className="text-center text-blue-600 underline">
              Download Receipt
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderResult;
