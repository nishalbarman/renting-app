import React, { memo } from "react";
import { View, Text, Animated } from "react-native";

function OrderTrackSkeleton() {
  const animationValue = new Animated.Value(0);

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

  const opacityAnimation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View className="p-4">
      <View className="flex flex-col items-center gap-y-5 pb-10">
        <Animated.View
          className="font-[poppins-bold] text-[21px] mb-3 bg-gray-300 rounded h-6 w-48"
          style={{ opacity: opacityAnimation }}
        />

        <View className="mb-10 gap-y-3">
          <View className="flex-row items-start mt-[5px] mb-[5px]">
            <Animated.View
              className="mr-3 items-center justify-center rounded-full bg-gray-300 w-[50px] h-[50px] self-center"
              style={{ opacity: opacityAnimation }}
            />
            <View>
              <Animated.View
                className="font-bold text-[17px] bg-gray-300 rounded h-5 w-32"
                style={{ opacity: opacityAnimation }}
              />
              <Animated.View
                className="text-[13px] font-bold text-gray-500 mt-1 bg-gray-300 rounded h-4 w-24"
                style={{ opacity: opacityAnimation }}
              />
            </View>
          </View>
          <View className="flex-row items-start mt-[5px] mb-[5px]">
            <Animated.View
              className="mr-3 items-center justify-center rounded-full bg-gray-300 w-[50px] h-[50px] self-center"
              style={{ opacity: opacityAnimation }}
            />
            <View>
              <Animated.View
                className="font-bold text-[17px] bg-gray-300 rounded h-5 w-32"
                style={{ opacity: opacityAnimation }}
              />
              <Animated.View
                className="text-[13px] font-bold text-gray-500 mt-1 bg-gray-300 rounded h-4 w-24"
                style={{ opacity: opacityAnimation }}
              />
            </View>
          </View>
          <View className="flex-row items-start mt-[5px] mb-[5px]">
            <Animated.View
              className="mr-3 items-center justify-center rounded-full bg-gray-300 w-[50px] h-[50px] self-center"
              style={{ opacity: opacityAnimation }}
            />
            <View>
              <Animated.View
                className="font-bold text-[17px] bg-gray-300 rounded h-5 w-32"
                style={{ opacity: opacityAnimation }}
              />
              <Animated.View
                className="text-[13px] font-bold text-gray-500 mt-1 bg-gray-300 rounded h-4 w-24"
                style={{ opacity: opacityAnimation }}
              />
            </View>
          </View>

          {/* Repeat the above structure for the remaining steps */}
        </View>
        <Animated.View
          className="flex items-center justify-center w-[200px] h-[49px] p-[0px_20px] bg-gray-300 rounded-lg"
          style={{ opacity: opacityAnimation }}
        />
      </View>
    </View>
  );
}

export default memo(OrderTrackSkeleton);
