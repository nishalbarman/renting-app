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
    <View className="p-[0_0_0_10px] mt-[5px] mb-[18px] w-[100%]">
      <View className="relative w-[100%] h-fit p-1 w-full">
        <Image
          className="h-[45px] w-[45px] absolute top-[-15px] left-[-15px] z-[999]"
          source={{
            uri: userIcon,
          }}
          contentFit="cover"
          contentPosition={"center"}
        />
        <View className="bg-white shadow rounded-md p-6 flex flex-col w-full">
          <Text className="font-[poppins-bold] text-[15px]">
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
            <Text>{new Date(feedBackDate).toDateString()}</Text>
          </View>
          <Text className="leading-[22px] font-[poppins] text-[16px] mt-1">
            {feedbackText}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default FeedbackCard;
