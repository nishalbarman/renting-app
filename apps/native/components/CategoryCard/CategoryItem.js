import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

function CategoryItem({ categoryImage, categoryName }) {
  return (
    <View className="w-fit h-fit flex flex-col align-center justify-center gap-y-2 m-2">
      <View className="bg-white w-fit h-fit rounded-full flex justify-center align-center shadow-sm">
        <Image
          className="h-[70px] w-[70px] rounded-full aspect-square"
          source={{
            uri: categoryImage,
          }}
          contentFit="contain"
          contentPosition={"center"}
        />
      </View>
      <Text className="font-[poppins-mid] self-center text-[12px] text-nowrap">
        {categoryName}
      </Text>
    </View>
  );
}

export default CategoryItem;
