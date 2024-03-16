import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";

const ProductSkeleton = ({ width }) => {
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
      className={`relative border-[1px] border-[#F0F3F4] flex flex-col h-fit ${
        width ? `w-[${width}]` : "w-[150px]"
      } flex-1 mb-[0.5px] bg-white rounded-md shadow-sm pb-[1%] m-1`}>
      <Animated.View
        style={{ opacity: opacityAnimation }}
        className="w-[100%] h-[200px] p-[3%] bg-gray-300 rounded-lg"
      />

      <View className="flex flex-col gap-y-1 w-[100%] mt-[5px] pl-2 pr-2 pb-2">
        <Animated.View
          style={{ opacity: opacityAnimation }}
          className="text-[14px] font-[poppins-mid] leading-[22px] w-[100%] bg-gray-300 rounded h-5 w-32"
        />

        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center justify-center h-fill">
            {Array.from({ length: 1 }).map((_, index) => (
              <Animated.View
                key={index}
                style={{ opacity: opacityAnimation }}
                className="bg-gray-300 rounded-full w-5 h-5 mx-1"
              />
            ))}
          </View>
          <Animated.View
            style={{ opacity: opacityAnimation }}
            className="text-[#A7A6A7] text-[13px] font-[poppins-mid] align-middle bg-gray-300 rounded h-4 w-12 ml-2"
          />
        </View>

        <View className="flex flex-col gap-y-[0.8px]">
          <Animated.View
            style={{ opacity: opacityAnimation }}
            className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black bg-gray-300 rounded h-6 w-24"
          />
          <Animated.View
            style={{ opacity: opacityAnimation }}
            className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black bg-gray-300 rounded h-6 w-32"
          />
        </View>
      </View>
    </View>
  );
};

export default ProductSkeleton;
