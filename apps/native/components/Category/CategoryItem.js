import React from "react";
import { Image, Text, View } from "react-native";

function CategoryItem({ categoryImage, categoryName }) {
  return (
    <View className="w-fit h-fit flex flex-col align-center justify-center gap-y-2 m-2">
      <View className="bg-[#f1d5cd] w-fit h-fit rounded-full flex justify-center align-center">
        <Image
          style={{
            resizeMode: "contain",
          }}
          className="bg-[#f1d5cd] h-[90px] w-[90px] mix-blend-multiply rounded-full aspect-square"
          source={{
            uri: categoryImage,
          }}
        />
      </View>
      <Text className="font-[mrt-bold] self-center text-[15px] text-nowrap">
        {categoryName}
      </Text>
    </View>
  );
}

export default CategoryItem;
