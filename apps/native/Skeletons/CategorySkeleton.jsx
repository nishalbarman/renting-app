import React, { memo, useEffect } from "react";
import { View, Animated } from "react-native";

const CategoryItemSkeleton = () => {
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
    <View className="w-fit h-fit flex flex-col align-center justify-center gap-y-2 m-2">
      <Animated.View
        style={{ opacity: opacityAnimation }}
        className="bg-white w-fit h-fit rounded-full flex justify-center align-center">
        <View className="h-[70px] w-[70px] rounded-full aspect-square bg-gray-300 animate-pulse" />
      </Animated.View>
      <Animated.View
        style={{ opacity: opacityAnimation }}
        className="font-[poppins-mid] self-center text-[12px] text-nowrap bg-gray-300 rounded h-4 w-20"
      />
    </View>
  );
};

export default memo(CategoryItemSkeleton);
