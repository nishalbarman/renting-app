import React, { useEffect } from "react";
import { View, Animated, SafeAreaView, ScrollView } from "react-native";

const SingleProductSkeleton = () => {
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
    <SafeAreaView className="bg-white">
      <ScrollView>
        {/* carousel view skeleton */}
        <View className="w-[100%] px-2 pt-10 flex items-center">
          {/* Carousel Skeleton */}
          <Animated.View
            style={{
              opacity: opacityAnimation,
            }}
            className="w-[100%] h-[300px] bg-gray-200 animate-pulse"></Animated.View>
        </View>

        {/* product body skeleton */}
        <View className="flex flex-1 p-[12px] flex-col gap-y-5">
          {/* Title Skeleton */}
          <View className="w-[100%] h-[30px] bg-gray-200 animate-pulse"></View>

          {/* Rating and Star Skeleton */}
          <View className="flex flex-row gap-x-2 items-center">
            {/* Star Icons Skeleton */}
            <View className="flex flex-row items-center justify-center">
              <View className="w-[20px] h-[20px] bg-gray-200 animate-pulse"></View>
              <View className="w-[20px] h-[20px] bg-gray-200 animate-pulse"></View>
              <View className="w-[20px] h-[20px] bg-gray-200 animate-pulse"></View>
              <View className="w-[20px] h-[20px] bg-gray-200 animate-pulse"></View>
              <View className="w-[20px] h-[20px] bg-gray-200 animate-pulse"></View>
            </View>
            {/* Total Feedbacks Skeleton */}
            <View className="w-[50px] h-[20px] bg-gray-200 animate-pulse"></View>
          </View>

          {/* Size and Color Section Skeleton */}
          <View className="bg-white rounded-[10px] p-4 pt-5 pb-5 rounded-[10px] shadow-sm bg-[#eadff2]">
            {/* Size Section Skeleton */}
            <View className="flex flex-col pb-4 gap-y-2">
              {/* Selected Size Skeleton */}
              <View className="w-[100px] h-[20px] bg-gray-200 animate-pulse"></View>
              {/* Size Options Skeleton */}
              <View className="flex flex-row gap-x-2">
                <View className="w-[40px] h-[40px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[40px] h-[40px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[40px] h-[40px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[40px] h-[40px] bg-white animate-pulse rounded-lg m-2"></View>
              </View>
            </View>

            {/* Color Section Skeleton */}
            <View className="flex flex-col pb-2 gap-y-2">
              {/* Selected Color Skeleton */}
              <View className="w-[100px] h-[20px] bg-white animate-pulse"></View>
              {/* Color Options Skeleton */}
              <View className="flex flex-row gap-x-2">
                <View className="w-[39px] h-[39px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[39px] h-[39px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[39px] h-[39px] bg-white animate-pulse rounded-lg m-2"></View>
                <View className="w-[39px] h-[39px] bg-white animate-pulse rounded-lg m-2"></View>
              </View>
            </View>
          </View>

          {/* Price and Quantity Section Skeleton */}
          <View>
            {/* Price and Quantity Skeleton */}
            <View className="flex flex-row justify-between items-center gap-y-1 p-[0px_10px]">
              {/* Price Skeleton */}
              <View className="flex gap-y-2">
                <View className="w-[100px] h-[30px] bg-gray-200 animate-pulse"></View>
              </View>
              {/* Quantity Skeleton */}
              <View className="flex flex-col gap-y-2">
                <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                  <View className="w-[37px] h-[37px] bg-gray-200 animate-pulse rounded-full"></View>
                  <View className="w-[90px] mx-2 h-[30px] bg-gray-200 animate-pulse"></View>
                  <View className="w-[37px] h-[37px] bg-gray-200 animate-pulse rounded-full"></View>
                </View>
                <View className="w-[100px] h-[20px] bg-gray-200 animate-pulse"></View>
              </View>
            </View>

            {/* Buy Now or Add to Cart Button Skeleton */}
            <View className="pt-7 flex flex-row gap-y-3 gap-x-5 justify-center items-center">
              <View className="w-[150px] h-[55px] bg-gray-200 animate-pulse rounded-md flex items-center justify-center"></View>
              <View className="w-[150px] h-[55px] bg-gray-200 animate-pulse rounded-md flex items-center justify-center"></View>
            </View>
          </View>

          {/* Product Description Skeleton */}
          <View className="pt-4 pb-3 pl-1 pr-1">
            <View className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></View>
            <View className="w-[100%] h-[200px] bg-gray-200 animate-pulse mt-2"></View>
          </View>

          {/* Rating and Reviews Skeleton */}
          <View className=" pb-6 flex flex-col gap-y-2 pl-1 pr-1">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-col gap-y-2">
                <View className="w-[150px] h-[20px] bg-gray-200 animate-pulse"></View>
                <View className="w-[100px] h-[20px] bg-gray-200 animate-pulse"></View>
              </View>
              <View className="w-[40px] h-[40px] bg-gray-200 animate-pulse rounded-full flex items-center justify-center"></View>
            </View>

            {/* Feedback Cards Skeleton */}
            <View className="flex flex-col items-center">
              <View className="w-full">
                <View className="w-full h-[100px] bg-gray-200 animate-pulse rounded-md mt-2"></View>
                <View className="w-full h-[100px] bg-gray-200 animate-pulse rounded-md mt-2"></View>
              </View>
              <View className="w-[200px] h-[48px] bg-gray-200 animate-pulse flex items-center justify-center mt-2 rounded-lg"></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleProductSkeleton;
