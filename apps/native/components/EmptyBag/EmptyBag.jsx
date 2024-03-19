import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

function index() {
  return (
    <View className="flex items-center justify-center mt-10">
      <Image
        source={require("../../assets/illustrations/lost.svg")}
        width={200}
        height={200}
      />
      <Text className="font-bold text-lg">No items found</Text>
    </View>
  );
}

export default index;
