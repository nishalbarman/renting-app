import React from "react";
import { View } from "react-native";

function AddressCardSkeletop() {
  return (
    <>
      <View className="pt-2 px-1 justify-center mt-1 w-[100%]">
        {[1, 2, 3].map((index) => (
          <View
            key={index}
            className="bg-light-blue-200 p-4 rounded-md border border-gray-300 mb-3 w-[100%] animate-pulse">
            <View className="text-black font-medium mb-2 animate-pulse w-[60%] h-[16px] bg-gray-200 rounded-md" />
            <View className="text-gray-700 mb-2 animate-pulse w-[80%] h-[16px] bg-gray-200 rounded-md" />
            <View className="text-gray-700 animate-pulse w-[50%] h-[16px] bg-gray-200 rounded-md" />
          </View>
        ))}
      </View>
    </>
  );
}

export default AddressCardSkeletop;
