import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Linking,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import AnimateSpin from "../AnimateSpin/AnimateSpin";
import { SheetManager } from "react-native-actions-sheet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { orderRefetch } from "@store/rtk";
import OrderStatus from "./OrderStatus";
import { useRouter } from "expo-router";

function OrderItem({
  order: {
    _id,
    orderGroupID,
    paymentTxnId,
    user,
    previewImage,
    title,
    price,
    shippingPrice,
    orderType,
    rentDays,
    orderStatus,
    paymentType,
    paymentStatus,
    rentReturnDueDate,
    color,
    size,
    quantity,
    trackingLink,
  },
  productType,
  jwtToken,
}) {
  const dispatch = useDispatch();

  console.log(paymentTxnId);

  const [cancelLoading, setCancelLoading] = useState();
  const [trackLoading, setTrackLoading] = useState();

  const rentTotalTimeRemaining = useMemo(() => {
    const returnDate = new Date("2024-04-30T13:41:55.646+00:00");
    const today = new Date();

    // console.log(returnDate.getTime(), today.getTime());
    // Calculating the time difference
    // of two dates
    let Difference_In_Time = returnDate.getTime() - today.getTime();
    // console.log(Difference_In_Time);
    // // Calculating the no. of days between
    // // two dates
    let totalTimeRemaining = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    // console.log(totalTimeRemaining);
    return totalTimeRemaining;
  }, [rentReturnDueDate]);

  const handleTrackOrder = () => {
    setTrackLoading(true);
    Linking.canOpenURL(trackingLink).then((supported) => {
      if (supported) {
        Linking.openURL(trackingLink);
      } else {
        console.log("Some error occured");
      }
    });
    // SheetManager.show("track-order", {
    //   payload: {
    //     orderId: "iamorderid",
    //   },
    // });
    setTrackLoading(false);
  };

  const handleCancelOrder = async () => {
    try {
      setCancelLoading(true);
      const response = await axios.patch(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/cancel`,
        { orderId: _id },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // console.log("Order cancelation log --> ", response.data);
      dispatch(orderRefetch());
    } catch (error) {
      console.error(error);
    } finally {
      setCancelLoading(false);
    }
  };

  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "order-view",
          params: { paymentTransactionId: paymentTxnId },
        });
      }}
      className="bg-white shadow p-2 pb-4 pt-4 rounded-md mb-[10px] border border-gray-300">
      {(orderStatus === "On Hold" || orderStatus === "On Progress") && (
        <View className="bg-orange-100 px-3 py-2 mt-[-5px] rounded-md mb-3 border border-orange-200">
          <Text className="text-[#e86813] font-[poppins] text-sm tracking-wide">
            We are proccessing your order. You will recieve a confirmation call
            from us.
          </Text>
        </View>
      )}

      {orderStatus === "Cancelled" && (
        <View className="bg-red-200 border border-red-500 px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-red-900 font-[poppins] text-sm tracking-wide">
            You cancelled the order, further proccessing stopped
          </Text>
        </View>
      )}

      {orderStatus === "Accepted" && (
        <View className="border border-[#79E7A8] bg-[#f5fff6] px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#36664c] font-[poppins] text-sm tracking-wide">
            Your order has been accepted and is now being moved for further
            processing.
          </Text>
        </View>
      )}

      {orderStatus === "Pending" && (
        <View className="bg-[#a1c6e3] border border-blue-400 px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#1d3345] font-[poppins] text-sm tracking-wide">
            Your order is in pending state, and will be procced automatically
            once confirmed.
          </Text>
        </View>
      )}

      {orderType === "rent" && orderStatus === "PickUp Ready" && (
        <View className="bg-orange-100 px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#e86813] font-[poppins] text-sm tracking-wide">
            Your product is ready and waiting for you!
          </Text>
        </View>
      )}
      <View className={`flex-row p-1 gap-x-5`}>
        <Image
          source={{
            uri: previewImage,
          }}
          className={`w-[100px] aspect-square self-center rounded`}
          contentFit="contain"
          contentPosition={"center"}
        />

        <View className={`ml-3 flex-1`}>
          <Text
            numberOfLines={3}
            className={`text-lg font-[poppins] text-sm flex-wrap leading-[25px]`}>
            {title}
          </Text>
          <View className="mt-2">
            {!!color && (
              <View className={`flex-row`}>
                <Text className={`text-[#5e5e5e]`}>Color:</Text>
                <Text className={`ml-1`}>{color}</Text>
              </View>
            )}

            {!!size && (
              <View className={`flex-row mt-1`}>
                <Text className={`text-[#5e5e5e]`}>Size:</Text>
                <Text className={`ml-1`}>{size}</Text>
              </View>
            )}

            <View className={`flex-row mt-1`}>
              <Text className={`text-[#5e5e5e]`}>Qty:</Text>
              <Text className={`ml-1`}>{quantity}</Text>
            </View>

            {orderType === "rent" && (
              <View className={`flex-row mt-1`}>
                <Text className={`text-[#5e5e5e]`}>Days:</Text>
                <Text className={`ml-1`}>{rentDays}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {orderType === "rent" && !!rentReturnDueDate && (
        <View className="flex-row items-center justify-start mt-2 mb-1">
          <AntDesign name="infocirlce" size={22} color="#349fd9" />

          <Text className="text-[15px] text-[#349fd9] leading-[20px] text-wrap pl-2 pr-4">
            {rentTotalTimeRemaining < 0
              ? "Return date already exceeded, kindly return the item as soon as possible."
              : rentTotalTimeRemaining > 0
                ? rentReturnDueDate + "Days remaining to return"
                : "Today is the due date to return the ordered item."}
          </Text>
        </View>
      )}

      <View className={`h-fit justify-between px-2`}>
        <View className={`flex-col`}>
          {orderType === "buy" ? (
            <Text className={`text-black font-bold text-xl`}>₹{price}</Text>
          ) : (
            <Text className={`text-black font-bold text-xl`}>
              ₹{price} / Day
            </Text>
          )}
        </View>
        <View className="flex-row mt-1">
          <Text className="font-bold text-md">Status: </Text>
          <Text className="text-md">{orderStatus}</Text>
        </View>
      </View>
      {/* <View className={`flex-row items-center h-fit justify-between px-2`}>
        <View className={`flex-col`}>
          {orderType === "buy" ? (
            <Text className={`text-black font-bold text-xl`}>₹{price}</Text>
          ) : (
            <Text className={`text-black font-bold text-xl`}>
              ₹{price} / Day
            </Text>
          )}
        </View>
        <OrderStatus orderStatus={orderStatus} />
      </View> */}

      <View
        className={`flex-row mt-5 justify-between flex-1 pt-3 ${
          (orderStatus === "On Hold" ||
            orderStatus === "On Progress" ||
            orderStatus === "On The Way" ||
            orderStatus === "Accepted") &&
          "border-t border-gray-200"
        }`}>
        {(orderStatus === "On Hold" ||
          orderStatus === "On Progress" ||
          orderStatus === "Accepted") && (
          <Pressable
            underlayColor={"white"}
            onPress={handleCancelOrder}
            style={{
              flexBasis: "auto",
              flexShrink: 0,
              flexGrow: 1,
            }}
            className="bg-white border border-gray-400 pl-2 pr-2 h-11 flex items-center justify-center rounded-lg">
            {cancelLoading ? (
              <AnimateSpin>
                <EvilIcons name="spinner" size={24} color="black" />
              </AnimateSpin>
            ) : (
              <>
                {/* <MaterialCommunityIcons name="cancel" size={24} color="black" /> */}
                <Text className="font-semibold text-md text-black font-bold">
                  Cancel
                </Text>
              </>
            )}
          </Pressable>
        )}
        {orderType === "buy" &&
          orderStatus === "On The Way" &&
          !!trackingLink &&
          (orderStatus === "On Hold" ||
            orderStatus === "On Progress" ||
            orderStatus === "Accepted") && <View className="w-[4%]"></View>}
        {orderType === "buy" &&
          orderStatus === "On The Way" &&
          !!trackingLink && (
            <Pressable
              onPress={handleTrackOrder}
              underlayColor={"orange"}
              style={{
                flexBasis: "auto",
                flexShrink: 0,
                flexGrow: 1,
              }}
              className="bg-orange-600 pl-2 pr-2 h-11 flex items-center justify-center rounded-lg">
              {trackLoading ? (
                <AnimateSpin>
                  <EvilIcons name="spinner" size={24} color="white" />
                </AnimateSpin>
              ) : (
                <Text className="font-semibold text-lg text-white font-bold">
                  Track
                </Text>
              )}
            </Pressable>
          )}
      </View>
    </Pressable>
  );
}

export default OrderItem;
