import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

function index({ message }) {
  return (
    <View className="flex items-center justify-center h-full">
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/crafter-ecommerce.appspot.com/o/app_illustrations%2Fshop.gif?alt=media&token=d0495c09-1507-445c-82c2-c014acb37ff9",
        }}
        width={200}
        height={200}
      />
      <Text className="text-lg">{message}</Text>
    </View>
  );
}

export default index;
