import React from "react";
import { Image, Text, View } from "react-native";

function FeedbackCard({
  userIcon,
  feedbackGivenBy,
  feedBackDate,
  feedbackText,
}) {
  return (
    <View className="p-[0_20px] mt-[13px] mb-[13px]">
      <View className="relative w-[100%] h-fit p-1">
        <Image
          className="h-[45px] w-[45px] absolute top-[-15px] left-[-15px] z-[999]"
          source={{
            uri: userIcon,
          }}
          contentFit="cover"
          contentPosition={"center"}
        />
        <View className="bg-white shadow rounded-md p-6 flex flex-col gap-y-2">
          <Text className="font-[mrt-bold] text-[15px]">{feedbackGivenBy}</Text>
          <View className="flex flex-row justify-between gap-x-4">
            <View className="flex gap-x-1 flex-row">
              <Text>⭐</Text>
              <Text>⭐</Text>
              <Text>⭐</Text>
              <Text>⭐</Text>
              <Text>⭐</Text>
              <Text>⭐</Text>
            </View>
            <View>
              <Text>{feedBackDate}</Text>
            </View>
          </View>
          <Text className="leading-[22px] font-[mrt] text-[15px]">
            {feedbackText}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default FeedbackCard;
