import React from "react";
import FeedbackCardSkeleton from "./FeedbackCardSkeleton";
import { View } from "react-native";

function ProductPageSkeleton() {
  return (
    <>
      {/* Carousel view skeleton */}
      <View className="w-[100%] px-2 flex items-center">
        {/* Placeholder for carousel */}
        <View className="bg-gray-200 w-[100%] h-[300px]" />
        {/* Placeholder for dots carousel */}
        <View className="bg-gray-200 w-[100%] h-[10px]" />
      </View>
      {/* Product body skeleton */}
      <View className="flex flex-1 p-[12px] flex-col gap-y-5">
        {/* Placeholder for product title */}
        <View className="bg-gray-200 w-[70%] h-[20px]" />

        {/* Rating and stars section */}
        <View className="flex flex-row gap-x-2 items-center">
          {/* Star icons skeleton */}
          <View className="flex flex-row gap-x-1">
            <View className="bg-gray-200 w-[20px] h-[20px] rounded-full" />
            <View className="bg-gray-200 w-[20px] h-[20px] rounded-full" />
            <View className="bg-gray-200 w-[20px] h-[20px] rounded-full" />
            <View className="bg-gray-200 w-[20px] h-[20px] rounded-full" />
            <View className="bg-gray-200 w-[20px] h-[20px] rounded-full" />
          </View>
          {/* Placeholder for total feedbacks */}
          <View className="bg-gray-200 w-[50px] h-[20px]" />
        </View>

        {/* Size and color section */}
        <View className="bg-gray-200 p-4 pt-5 pb-5 rounded-[10px] shadow-sm">
          {/* Placeholder for size section */}
          <View className="bg-gray-200 w-[70%] h-[20px]" />
          {/* Placeholder for size options */}
          <View className="bg-gray-200 w-[100%] h-[40px]" />
          {/* Placeholder for color section */}
          <View className="bg-gray-200 w-[70%] h-[20px] mt-4" />
          {/* Placeholder for color options */}
          <View className="bg-gray-200 w-[100%] h-[40px]" />
        </View>

        {/* Price and quantity section */}
        <View className="flex flex-row justify-between items-center gap-y-1 p-[0px_10px]">
          {/* Placeholder for price */}
          <View className="bg-gray-200 w-[50%] h-[50px] mr-2" />
          {/* Placeholder for quantity section */}
          <View className="bg-gray-200 w-[50%] h-[50px]" />
        </View>

        {/* Product description section */}
        <View className="pt-2 pl-1 pr-1">
          {/* Placeholder for product details title */}
          <View className="bg-gray-200 w-[30%] h-[20px] mb-3" />
          {/* Placeholder for product description */}
          <View className="bg-gray-200 w-[100%] h-[100px]" />
        </View>

        {/* Rating and reviews section */}
        <View className="pb-6 flex flex-col gap-y-2 pl-1 pr-1">
          {/* Placeholder for feedbacks title */}
          <View className="bg-gray-200 w-[30%] h-[20px]" />
          {/* Placeholder for stars and feedbacks count */}
          <View className="bg-gray-200 w-[70%] h-[20px]" />
          {/* Placeholder for feedback cards */}
          <View className="flex flex-col pt-6">
            {/* Placeholder for feedback card */}
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
          </View>
        </View>
      </View>
    </>
  );
}

export default ProductPageSkeleton;
