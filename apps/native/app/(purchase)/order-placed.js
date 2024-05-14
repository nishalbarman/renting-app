import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import axios from "axios";

import LottieView from "lottie-react-native";
import { useGetCartQuery } from "@store/rtk";
import { Ionicons } from "@expo/vector-icons";

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
        `${process.env.EXPO_PUBLIC_API_URL}/orders/view/${params.paymentTransactionId || "pi_3PMcvTSDNHKhH7My16kIm1ig"}`,
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

  const lottieViewRef = useRef(null);

  const triggerConfetti = () => {
    lottieViewRef.current?.play(0);
  };

  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    triggerConfetti();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Order Placed",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: (props) => (
            <Pressable
              onPress={() => {
                if (props.canGoBack) {
                  router.dismiss();
                }
                router.replace("/my_orders");
              }}
              className="p-2 mr-3 border border-gray-200 rounded-full">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <FlatList
        contentContainerStyle={{
          // alignItems: "center",
          justifyContent: "center",
          // minHeight: "100%",
        }}
        data={[""]}
        renderItem={() => {
          return (
            <>
              {isLoading ? (
                <View className="w-full h-screen items-center justify-center">
                  <ActivityIndicator size={40} color={"green"} />
                </View>
              ) : (
                <>
                  <View
                    className="top-0 absolute"
                    style={styles.lottie}
                    pointerEvents="box-none">
                    <AnimatedLottieView
                      ref={lottieViewRef}
                      source={require("../../assets/lottie/celebration.json")}
                      progress={animationProgress.current}
                      autoPlay={true}
                      loop={false}
                      style={styles.lottie}
                    />
                  </View>

                  <View className="flex-1 justify-center items-center my-5">
                    <View className="bg-white p-2 rounded-lg w-11/12 max-w-md py-4 border-none px-3 border-gray-300">
                      <View className="items-center mb-4">
                        <View className="bg-green-500 rounded-full p-2">
                          <AntDesign
                            name="checkcircleo"
                            size={60}
                            color="white"
                          />
                        </View>
                      </View>
                      <Text className="">
                        #
                        {orderDetails?.order[0]?.orderGroupID
                          .toString()
                          .toUpperCase()}
                      </Text>
                      <Text className="text-2xl font-semibold text-gray-800 my-1">
                        Success
                      </Text>
                      <Text className="text-gray-600">
                        You're Successfully Placed Order.
                      </Text>

                      <View className="bg-green-100 text-green-700 py-2 px-4 rounded-lg my-4 text-3xl font-semibold">
                        <Text>Rs. {orderDetails?.totalPrice}</Text>
                      </View>
                      <Text className="text-gray-500">Request Amount</Text>
                      <View className="mt-3">
                        <View className="flex-row flex-wrap justify-between items-center text-gray-700">
                          <Text>Txn ID : </Text>
                          <Text className="font-semibold">
                            {orderDetails?.order[0]?.paymentTxnId}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center text-gray-700 mt-4">
                          <Text>Items</Text>
                          {/* <Text className="font-semibold">Lurch Schpellchek</Text> */}
                        </View>
                        <FlatList
                          className="w-full h-fit pb-5 mt-1"
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

                      <Text className="font-semibold my-1">
                        {new Date(
                          orderDetails?.order[0]?.createdAt
                        ).toDateString()}
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          router.replace("/my_orders");
                        }}
                        className="mt-6 bg-green-600 py-3 rounded-full">
                        <Text className="text-center text-white font-semibold">
                          My Order
                        </Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity className="mt-2">
            <Text className="text-center text-blue-600 underline">
              Download Receipt
            </Text>
          </TouchableOpacity> */}
                    </View>
                  </View>
                </>
              )}
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default OrderResult;

const styles = StyleSheet.create({
  lottie: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: "none",
  },
});
