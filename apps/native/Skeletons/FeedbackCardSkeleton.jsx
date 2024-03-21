import React from "react";
import { Text, View } from "react-native";

function FeedbackCardSkeleton() {
  return (
    <View className="p-[0_0_0_10px] mt-[5px] mb-[18px] w-[100%]">
      <View className="relative w-[100%] h-fit p-1 w-full">
        <View className="h-[45px] w-[45px] absolute top-[-15px] left-[-15px] z-[999] bg-gray-200 rounded-full" />
        <View className="bg-white shadow rounded-md p-6 flex flex-col w-full">
          <View className="font-[poppins-bold] text-[15px] bg-gray-200 h-[20px] w-[60%] mb-2 rounded-md" />
          <View className="flex flex-row justify-between items-center flex-wrap">
            <View className="flex flex-row items-center justify-center gap-x-1 mb-2">
              <View className="w-[20px] h-[20px] bg-gray-200 rounded-full" />
              <View className="w-[20px] h-[20px] bg-gray-200 rounded-full" />
              <View className="w-[20px] h-[20px] bg-gray-200 rounded-full" />
              <View className="w-[20px] h-[20px] bg-gray-200 rounded-full" />
              <View className="w-[20px] h-[20px] bg-gray-200 rounded-full" />
            </View>
            <Text className="bg-gray-200 h-[18px] w-[100px] rounded-md" />
          </View>
          <Text className="leading-[22px] font-[poppins] text-[16px] mt-1 bg-gray-200 h-[80px] rounded-md" />
        </View>
      </View>
    </View>
  );
}

export default FeedbackCardSkeleton;
