import { AntDesign } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";

function FeedbackCard({
  userIcon,
  feedbackGivenBy,
  starsGiven,
  feedBackDate,
  feedbackText,
}) {
  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  return (
    <View className="pl-2 mt-1 mb-[18px] w-full border-none border-gray-300 rounded-md">
      <View className="relative w-full h-fit p-1 w-full">
        <Image
          className="h-[45px] w-[45px] rounded-full absolute top-[-15px] left-[-15px] z-[999]"
          source={{
            uri: userIcon,
          }}
          contentFit="cover"
          contentPosition={"center"}
        />
        <View
          style={{
            elevation: 2,
          }}
          className="bg-white rounded-md p-6 flex flex-col w-full">
          <Text className="font-[roboto-bold] text-[15px]">
            {feedbackGivenBy}
          </Text>
          <View className="flex flex-row justify-between items-center flex-wrap">
            <View className="flex flex-row items-center justify-center gap-x-1 mb-2">
              {starsArray.map((item, index) => {
                return (
                  <AntDesign
                    key={index}
                    name={
                      index + 1 <= Math.round(starsGiven) ? "star" : "staro"
                    }
                    size={20}
                    color={
                      index + 1 <= Math.round(starsGiven) ? "orange" : "black"
                    }
                  />
                );
              })}
            </View>
            <Text className="text-sm">
              {new Date(feedBackDate).toDateString()}
            </Text>
          </View>
          <Text className="leading-[22px] font-[roboto] text-[16px] mt-2">
            {feedbackText}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default FeedbackCard;
