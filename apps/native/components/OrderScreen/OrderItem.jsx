import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import { SheetManager } from "react-native-actions-sheet";

function OrderItem({
  order: {
    txnid,
    user,
    previewUrl,
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
}) {
  const [cancelLoading, setCancelLoading] = useState();
  const [trackLoading, setTrackLoading] = useState();

  const rentTotalTimeRemaining = useMemo(() => {
    const returnDate = new Date("2024-03-15T13:41:55.646+00:00");
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
  }, []);

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
    setCancelLoading(true);

    // TODO : Cancel request
    await new Promise((res) => {
      setTimeout(res, 1000);
    });

    setCancelLoading(false);
  };

  return (
    <View className="bg-white shadow p-2 pb-4 pt-4 rounded-md mb-[10px]">
      <View className={`flex-row p-1 gap-x-5`}>
        <Image
          source={{
            uri: previewUrl,
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
            {!!color?.title && (
              <View className={`flex-row`}>
                <Text className={`text-[#5e5e5e]`}>Color:</Text>
                <Text className={`ml-1`}>{color?.title}</Text>
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

            {!!size?.title && (
              <View className={`flex-row mt-1`}>
                <Text className={`text-[#5e5e5e]`}>Size:</Text>
                <Text className={`ml-1`}>{size?.title}</Text>
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
      {orderType === "rent" && (
        <View className="flex-row items-center justify-start mt-4 mb-1">
          <AntDesign name="infocirlce" size={22} color="#349fd9" />
          <Text className="text-[15px] text-[#349fd9] leading-[20px] text-wrap pl-2 pr-4">
            {rentTotalTimeRemaining < 0
              ? "Due date for returning has exceeded already, you will be charged with some penalty amount"
              : rentTotalTimeRemaining > 0
                ? rentReturnDueDate + "Days remaining to return"
                : "Today is the due date to return the ordered item."}
          </Text>
        </View>
      )}

      {/* <Text className="bg-[#ffe9d6] text-[#bf6415] border border-[#bf6415] rounded-md text-[10px] pt-[7px] pb-[7px] pl-[2px] pr-[2px] text-center align-middle mt-5 ml-2 mr-2 mb-1 uppercase font-extrabold">
        {orderType === "rent" ? "Rented" : "Bought"}
      </Text> */}

      <View className="flex-row mt-3 justify-between">
        <TouchableHighlight
          underlayColor={"white"}
          onPress={handleCancelOrder}
          className="bg-white border pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg w-[48%]">
          {cancelLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="black" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-lg">Cancel</Text>
          )}
        </TouchableHighlight>
        <View className="w-[4%]"></View>
        <TouchableHighlight
          onPress={handleTrackOrder}
          underlayColor={"#514FB6"}
          className="bg-[#514FB6] border pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg w-[48%]">
          {trackLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="white" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-lg text-white">Track</Text>
          )}
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default OrderItem;
