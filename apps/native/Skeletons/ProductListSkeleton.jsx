import React, { memo, useEffect } from "react";
import { View, Animated, FlatList } from "react-native";
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
      className={`w-screen px-2 h-fit rounded`}>
      <View className="flex-row justify-between mb-1">
        <Animated.View
          style={{ opacity: opacityAnimation }}
          className="font-[poppins-xbold] text-[22px] bg-gray-300 rounded h-11 flex-1"
        />
        <View className="w-2 bg-white"></View>
        <Animated.View
          style={{ opacity: opacityAnimation }}
          className="text-[15px] text-purple font-[poppins-bold] underline bg-gray-300 rounded h-11 flex-1"
        />
      </View>

      <View>
        <FlatList
          className="w-full"
          data={Array.from({ length: 6 })}
          renderItem={({ item, index }) => <ProductSkeleton key={index} />}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default memo(ProductsListSkeleton);
