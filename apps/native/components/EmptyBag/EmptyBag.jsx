import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

function index() {
  return (
    <View className="flex items-center justify-center h-[100%]">
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/crafter-ecommerce.appspot.com/o/app_illustrations%2Flost.svg?alt=media&token=https://firebasestorage.googleapis.com/v0/b/crafter-ecommerce.appspot.com/o/app_illustrations%2Flost.svg?alt=media&token=b601f916-3e3a-4ea7-9f7f-caf321d1a35a",
        }}
        width={200}
        height={200}
      />
      <Text className="text-lg">Your wishlist is empty</Text>
    </View>
  );
}

export default index;
