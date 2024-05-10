import axios from "axios";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";

const OrderView = () => {
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

  const handleTrackPackage = () => {
    if (isLoading) return;
    Linking.canOpenURL(orderDetails?.order[0]?.trackingLink).then(
      (supported) => {
        if (supported) {
          Linking.openURL(orderDetails?.order[0]?.trackingLink);
        } else {
          console.log("Some error occured");
        }
      }
    );
  };

  const router = useRouter();

  return (
    <SafeAreaView className={"bg-white min-h-full"}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerShown: true,
          title: "Status",
          headerTitleAlign: "center",
        }}
      />
      {isLoading ? (
        <View className="h-full w-full flex items-center justify-center">
          <ActivityIndicator size={45} color={"green"} />
        </View>
      ) : (
        <FlatList
          className="px-4 bg-white mt-2"
          data={[""]}
          renderItem={() => {
            return (
              <>
                <View>
                  <Text
                    className={
                      "text-lg text-gray-700 font-bold leading-[24px]"
                    }>
                    Order #{orderDetails?.order[0]?.orderGroupID}
                  </Text>
                  <Text className={"text-sm text-gray-500 mt-1"}>
                    Recived on{" "}
                    {new Date(
                      orderDetails?.order[0]?.createdAt
                    ).toLocaleDateString()}
                  </Text>
                  {orderDetails?.order[0]?.orderType === "rent" && (
                    <View className="bg-green-200 py-4 px-5 mt-3 rounded-md items-center">
                      <Text className={"text-sm font-bold text-green-800"}>
                        * This is a Rent Order, You need to pickup the item by
                        your self
                      </Text>
                    </View>
                  )}
                </View>
                <View className="border-t my-2 border-gray-300 mt-4"></View>
                <View className={""}>
                  {/* <Text className="text-gray-500">Request Amount</Text> */}
                  <View className="mt-6">
                    <View className="flex-row justify-between items-center text-gray-700">
                      <Text>Order ID</Text>
                      <Text className="font-semibold">
                        {orderDetails?.order[0]?.orderGroupID}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center text-gray-700 mt-1 ">
                      <Text>Txn ID</Text>
                      <Text className="font-semibold">
                        {orderDetails?.order[0]?.paymentTxnId}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center text-gray-700 mt-4">
                      <Text>Subtotal:</Text>
                      <Text className="font-semibold">
                        Rs.{orderDetails?.subTotalPrice}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center text-gray-700 mt-1">
                      <Text>Shipping Price:</Text>
                      <Text className="font-semibold">
                        Rs.{orderDetails?.shippingPrice}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center text-gray-700 mt-1">
                      <Text>Total Price:</Text>
                      <Text className="font-semibold">
                        Rs.{orderDetails?.totalPrice}
                      </Text>
                    </View>
                    {/* <View className="flex-row justify-between items-center text-gray-700">
                      <Text>Time:</Text>
                      <Text className="font-semibold">12:52 PM</Text>
                    </View> */}
                  </View>
                </View>

                {orderDetails?.order[0]?.orderType === "buy" && (
                  <>
                    <View className="border-t my-2 border-gray-300 mt-4"></View>
                    <View className={"my-2"}>
                      <Text className="text-lg text-gray-500 font-bold">
                        Tracking info
                      </Text>

                      <Text className={"text-sm text-gray-500 mt-1"}>
                        Current status: {orderDetails?.order[0]?.orderStatus}
                      </Text>

                      {orderDetails?.order[0]?.orderStatus === "On The Way" && (
                        <View className={"flex flex-row justify-between mt-4"}>
                          <TouchableOpacity
                            onPress={handleTrackPackage}
                            className={"bg-green-500 py-2 px-4 rounded-md"}>
                            <Text className={"text-white font-semibold"}>
                              Track Package
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View className="border-t my-2 border-gray-300 mt-4"></View>
                    <View className={"my-2"}>
                      <Text className="text-lg text-gray-500 font-bold mb-1">
                        Shipment Address
                      </Text>
                      <Text className={"text-sm text-gray-500"}>
                        {Object.values(
                          orderDetails?.order[0]?.address?.address || {}
                        ).join(", ")}
                      </Text>
                    </View>
                  </>
                )}

                {/* <TouchableOpacity className={"bg-gray-300 py-2 px-4 rounded-md"}>
          <Text className={"text-gray-700 font-semibold"}>Raise an issue</Text>
        </TouchableOpacity> */}

                <View className="border-t my-2 border-gray-300 mt-4"></View>

                <View className={"my-2"}>
                  <Text className="text-lg text-gray-500 font-bold mb-1">
                    Shipment Content
                  </Text>
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
                            <Text className="text-green-800">
                              {item?.title}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    }}
                  />
                </View>
              </>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderView;
