import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableHighlight,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

import AnimateSpin from "../AnimateSpin/AnimateSpin";
import { SheetManager } from "react-native-actions-sheet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { orderRefetch } from "@store/rtk/slices/orderSlice";

function OrderItem({
  order: {
    _id,
    txnid,
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

  const [cancelLoading, setCancelLoading] = useState();
  const [trackLoading, setTrackLoading] = useState();

  const rentTotalTimeRemaining = useMemo(() => {
    const returnDate = new Date("2024-04-30T13:41:55.646+00:00");
    const today = new Date();

    console.log(returnDate.getTime(), today.getTime());
    // Calculating the time difference
    // of two dates
    let Difference_In_Time = returnDate.getTime() - today.getTime();
    console.log(Difference_In_Time);
    // // Calculating the no. of days between
    // // two dates
    let totalTimeRemaining = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    console.log(totalTimeRemaining);
    return totalTimeRemaining;
  }, [rentReturnDueDate]);

  const handleTrackOrder = () => {
    setTrackLoading(true);
    SheetManager.show("track-order", {
      payload: {
        orderId: "iamorderid",
      },
    });
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
      console.log("Order cancelation log --> ", response.data);
      dispatch(orderRefetch());
    } catch (error) {
      console.error(error);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <View className="bg-white shadow p-2 pb-4 pt-4 rounded-md mb-[10px] border border-gray-300">
      {(orderStatus === "On Hold" || orderStatus === "On Progress") && (
        <View className="bg-orange-100 px-3 py-2 mt-[-5px] rounded-md mb-3 border border-orange-200">
          <Text className="text-[#e86813]">
            We are proccessing your order. You will recieve a confirmation call
            from us.
          </Text>
        </View>
      )}

      {orderStatus === "Accepted" && (
        <View className="border border-[#79E7A8] bg-[#f5fff6] px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#36664c]">
            Your order has been accepted and is now being moved for further
            processing.
          </Text>
        </View>
      )}

      {orderStatus === "Pending" && (
        <View className="bg-[#a1c6e3] border border-blue-400 px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#1d3345]">
            Your order is in pending state, and will be procced automatically
            once confirmed.
          </Text>
        </View>
      )}

      {orderType === "rent" && orderStatus === "PickUp Ready" && (
        <View className="bg-orange-100 px-3 py-2 mt-[-5px] rounded-md mb-3">
          <Text className="text-[#e86813]">
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
            className={`text-lg font-semibold flex-wrap leading-[25px]`}>
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
        <View className={`flex-col justify-between pb-2`}>
          {orderStatus === "On Progress" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#2AAABF] rounded-md bg-[#f0ffff]`}>
              <Text className={`text-[#2AAABF] text-[10px] font-bold`}>
                On Progress
              </Text>
            </View>
          ) : orderStatus === "Accepted" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#79E7A8] rounded-md bg-[#f5fff6]`}>
              <Text className={`text-[#36664c] text-[10px] font-bold`}>
                Accepted
              </Text>
            </View>
          ) : orderStatus === "Delivered" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#754db0] rounded-md bg-[#f0e6ff]`}>
              <Text className={`text-[#754db0] text-[10px] font-bold`}>
                Delivered
              </Text>
            </View>
          ) : orderStatus === "On Hold" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#ebb434] rounded-md bg-[#fff6c7]`}>
              <Text className={`text-[#7a5c14] text-[10px] font-bold`}>
                On Hold
              </Text>
            </View>
          ) : orderStatus === "Cancelled" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#db3125] rounded-md bg-[#f7eae9]`}>
              <Text className={`text-[#a11b12] text-[10px] font-bold`}>
                Cancelled
              </Text>
            </View>
          ) : orderStatus === "On The Way" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#2e7e85] rounded-md bg-[#b1ebf0]`}>
              <Text className={`text-[#2e7e85] text-[10px] font-bold`}>
                On The Way
              </Text>
            </View>
          ) : orderStatus === "PickUp Ready" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#754db0] rounded-md bg-[#f0e6ff]`}>
              <Text className={`text-[#754db0]  text-[10px] font-bold`}>
                PickUp Ready
              </Text>
            </View>
          ) : orderStatus === "Pending" ? (
            <View
              className={`flex-row justify-center p-2 border border-[#2c5778] rounded-md bg-[#a1c8e6]`}>
              <Text className={`text-[#2c5778]  text-[10px] font-bold`}>
                Pending
              </Text>
            </View>
          ) : (
            <View
              className={`flex-row justify-center p-2 border border-[#db3125] rounded-md bg-[#f7eae9]`}>
              <Text className={`text-[#a11b12] text-[10px] font-bold`}>
                Rejected
              </Text>
            </View>
          )}
          <View className={`flex-col mt-3`}>
            {orderType === "buy" ? (
              <Text className={`text-black font-bold text-xl`}>₹{price}</Text>
            ) : (
              <Text className={`text-black font-bold text-xl`}>
                ₹{price} / Day
              </Text>
            )}
          </View>
        </View>
      </View>
      {orderType === "rent" && !!rentReturnDueDate && (
        <View className="flex-row items-center justify-start mt-4 mb-1">
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

      {/* <Text className="bg-[#ffe9d6] text-[#bf6415] border border-[#bf6415] rounded-md text-[10px] pt-[7px] pb-[7px] pl-[2px] pr-[2px] text-center align-middle mt-5 ml-2 mr-2 mb-1 uppercase font-extrabold">
        {orderType === "rent" ? "Rented" : "Bought"}
      </Text> */}

      <View className="flex-row mt-3 justify-between flex-1">
        {(orderStatus === "On Hold" ||
          orderStatus === "On Progress" ||
          orderStatus === "Accepted") && (
          <TouchableHighlight
            underlayColor={"white"}
            onPress={handleCancelOrder}
            style={{
              flexBasis: "auto",
              flexShrink: 0,
              flexGrow: 1,
            }}
            className="bg-white border pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg">
            {cancelLoading ? (
              <AnimateSpin>
                <EvilIcons name="spinner" size={24} color="black" />
              </AnimateSpin>
            ) : (
              <Text className="font-semibold text-lg">Cancel</Text>
            )}
          </TouchableHighlight>
        )}
        {orderType === "buy" && <View className="w-[4%]"></View>}
        {orderType === "buy" &&
          orderStatus === "On The Way" &&
          !!trackingLink && (
            <TouchableHighlight
              onPress={handleTrackOrder}
              underlayColor={"#514FB6"}
              style={{
                flexBasis: "auto",
                flexShrink: 0,
                flexGrow: 1,
              }}
              className="bg-[#514FB6] border pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg">
              {trackLoading ? (
                <AnimateSpin>
                  <EvilIcons name="spinner" size={24} color="white" />
                </AnimateSpin>
              ) : (
                <Text className="font-semibold text-lg text-white">Track</Text>
              )}
            </TouchableHighlight>
          )}
      </View>
    </View>
  );
}

export default OrderItem;
