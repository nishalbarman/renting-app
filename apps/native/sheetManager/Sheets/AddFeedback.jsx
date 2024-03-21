import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

export default function AddFeedback({ payload }) {
  const handlers = useScrollHandlers();
  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const { jwtToken } = useSelector((state) => state.auth);

  const [currentUserReviewStar, setCurrentUserReviewStar] = useState(1);

  const [reviewDescription, setReviewDescription] = useState("");

  console.log(payload);

  const handleSubmitReview = async () => {
    try {
      console.log({
        starsGiven: currentUserReviewStar,
        description: reviewDescription,
      });
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks`,
        {
          starsGiven: currentUserReviewStar,
          description: reviewDescription,
          product: payload.productId,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Ok: Review Added!");
      }
    } catch (error) {
      console.error("Add Feedback Sheet ->", error);
    }
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-8 flex flex-col items-center gap-y-5 pb-10">
            <Text className="font-[poppins-bold] text-[21px]">
              Share your experience with this product?
            </Text>
            <View className="flex flex-row items-center justify-center gap-x-3">
              {starsArray.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentUserReviewStar(index + 1);
                    }}>
                    <AntDesign
                      name={
                        index + 1 <= Math.round(currentUserReviewStar)
                          ? "star"
                          : "staro"
                      }
                      size={35}
                      color={
                        index + 1 <= Math.round(currentUserReviewStar)
                          ? "orange"
                          : "black"
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="pl-10 pr-10 pt-4">
              <Text className="font-[poppins-mid] text-[18px] text-center">
                Please share your opinion about the product
              </Text>
            </View>
            <View className={"w-[90%] border rounded-lg"}>
              <TextInput
                onChangeText={(text) => {
                  setReviewDescription(text);
                }}
                multiline={true}
                className={`h-[250px] shadow-lg text-black p-4 placeholder:text-[18px] text-[18px] font-[poppins-mid]`}
                placeholder="Your review"
                placeholderTextColor={"grey"}
              />
            </View>
            <TouchableOpacity
              onPress={handleSubmitReview}
              className="flex items-center justify-center w-[200px] h-[52px] p-[0px_20px] bg-[#d875ff] rounded-lg">
              <Text className="text-white font-bold">Add Review</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
