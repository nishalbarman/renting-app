import React, { useEffect } from "react";
import { View, Text, Animated, FlatList } from "react-native";
import ProductSkeleton from "./ProductSkeleton";

const ProductsListSkeleton = ({ title, bgColor, titleColor, viewAllPath }) => {
  const animationValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacityAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View
      style={{
        backgroundColor: bgColor,
      }}
      className={`w-[100%] p-[20px_10px] h-fit rounded`}>
      <View className="flex flex-row justify-between p-[0px_1px] items-center mb-[16px]">
        <Animated.View
          style={{ opacity: opacityAnimation }}
          className="font-[poppins-xbold] text-[22px] bg-gray-300 rounded h-7 w-32"
        />
        <Animated.View
          style={{ opacity: opacityAnimation }}
          className="text-[15px] text-purple font-[poppins-bold] underline bg-gray-300 rounded h-7 w-16"
        />
      </View>

      <View className="flex flex-row flex-wrap gap-2">
        <FlatList
          data={Array.from({ length: 6 })}
          renderItem={({ item, index }) => <ProductSkeleton key={index} />}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default ProductsListSkeleton;
