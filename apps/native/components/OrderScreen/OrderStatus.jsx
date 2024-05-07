import React, { useMemo } from "react";
import { View, Text } from "react-native";

const OrderStatus = ({ orderStatus }) => {
  const statusStyles = useMemo(
    () => ({
      "On Progress": {
        container:
          "flex justify-center p-2 border m-0 border-[#2AAABF] rounded-md bg-[#f0ffff]",
        text: "text-[#2AAABF] text-[10px] font-bold",
      },
      Accepted: {
        container:
          "flex justify-center p-2 border m-0 border-[#79E7A8] rounded-md bg-[#f5fff6]",
        text: "text-[#36664c] text-[10px] font-bold",
      },
      Delivered: {
        container:
          "flex justify-center p-2 border m-0 border-[#754db0] rounded-md bg-[#f0e6ff]",
        text: "text-[#754db0] text-[10px] font-bold",
      },
      "On Hold": {
        container:
          "flex justify-center p-2 border m-0 border-[#ebb434] rounded-md bg-[#fff6c7]",
        text: "text-[#7a5c14] text-[10px] font-bold",
      },
      Cancelled: {
        container:
          "flex justify-center p-2 border m-0 border-[#db3125] rounded-md bg-[#f7eae9]",
        text: "text-[#a11b12] text-[10px] font-bold",
      },
      "On The Way": {
        container:
          "flex justify-center p-2 border m-0 border-[#2e7e85] rounded-md bg-[#b1ebf0]",
        text: "text-[#2e7e85] text-[10px] font-bold",
      },
      "PickUp Ready": {
        container:
          "flex justify-center p-2 border m-0 border-[#754db0] rounded-md bg-[#f0e6ff]",
        text: "text-[#754db0] text-[10px] font-bold",
      },
      Pending: {
        container:
          "flex justify-center p-2 border m-0 border-[#2c5778] rounded-md bg-[#a1c8e6]",
        text: "text-[#2c5778] text-[10px] font-bold",
      },
      Rejected: {
        container:
          "flex justify-center p-2 border m-0 border-[#db3125] rounded-md bg-[#f7eae9]",
        text: "text-[#a11b12] text-[10px] font-bold",
      },
    }),
    []
  );

  const currentStyle = statusStyles[orderStatus] || statusStyles["Rejected"];

  return (
    <View className={currentStyle.container}>
      <Text className={currentStyle.text}>{orderStatus}</Text>
    </View>
  );
};

export default OrderStatus;
