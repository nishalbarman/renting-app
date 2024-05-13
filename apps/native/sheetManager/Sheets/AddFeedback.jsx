import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import handleGlobalError from "../../lib/handleError";

export default function AddFeedback({ payload }) {
  const handlers = useScrollHandlers();
  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const { jwtToken } = useSelector((state) => state.auth);
  const { productType } = useSelector((state) => state.product_store);

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const [currentUserReviewStar, setCurrentUserReviewStar] = useState(1);
  const [reviewDescription, setReviewDescription] = useState("");

  const [alreadyGivenFeedback, setAlreadyGivenFeedback] = useState({});

  useEffect(() => {
    setCurrentUserReviewStar(alreadyGivenFeedback?.starsGiven || 1);
    setReviewDescription(alreadyGivenFeedback?.description || "");
  }, [alreadyGivenFeedback]);

  const getFeedbackGivenByUser = async () => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks/view/${payload.productId}`,
        {
          productType: productType,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (res.data?.feedback) {
        setAlreadyGivenFeedback(res.data?.feedback);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeedbackGivenByUser();
  }, []);

  const handleSubmitReview = async () => {
    try {
      setIsReviewSubmitting(true);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks`,
        {
          starsGiven: currentUserReviewStar,
          description: reviewDescription,
          product: payload.productId,
          productType: productType,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.status === 200) {
        Toast.show({
          type: "sc",
          message: "Review Added!",
        });
      }
    } catch (error) {
      console.error("Add Feedback Sheet ->");
      handleGlobalError(error);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-8 flex flex-col items-center gap-y-5 pb-10">
            <Text className="font-[roboto-bold] text-[21px]">
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
              <Text className="font-[roboto-mid] text-[18px] text-center">
                Please share your opinion about the product
              </Text>
            </View>
            <View className={"w-[90%] border rounded-lg"}>
              <TextInput
                value={reviewDescription}
                onChangeText={(text) => {
                  setReviewDescription(text);
                }}
                multiline={true}
                className={`h-[250px] shadow-lg text-black p-4 placeholder:text-[18px] text-[18px] font-[roboto-mid]`}
                placeholder="Your review"
                placeholderTextColor={"grey"}
              />
            </View>
            <TouchableOpacity
              disabled={isReviewSubmitting}
              onPress={handleSubmitReview}
              className="flex items-center justify-center w-[200px] h-[52px] p-[0px_20px] bg-[#d875ff] rounded-lg">
              {isReviewSubmitting ? (
                <ActivityIndicator size={25} color={"white"} />
              ) : Object.keys(alreadyGivenFeedback).length > 0 ? (
                <Text className="text-white font-bold">Update Review</Text>
              ) : (
                <Text className="text-white font-bold">Add Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
