import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

function index() {
  return (
    <View className="flex items-center justify-center h-[100%]">
      {/* <Image
        source={require("../../assets/illustrations/lost.svg")}
        width={200}
        height={200}
      /> */}
      <Text className="text-lg">Your wishlist is empty</Text>
    </View>
  );
}

export default index;
