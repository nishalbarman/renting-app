import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

function CartItem({
  cart: { previewUrl, title, buyOrRent, quantity, availableStocks },
}) {
  return (
    <View className="mb-[10px] flex-row bg-white p-[10px] rounded-lg shadow ml-2 mr-2">
      <Image
        // source={{ uri: previewUrl }}
        source={{ uri: "https://picsum.photos/200/300?grayscale" }}
        className="w-[80px] h-[80px] mr-5"
        contentFit="contain"
        contentPosition={"center"}
      />
      <View className="flex-1">
        <Text numberOfLines={2} className="text-[15px] font-[poppins-mid]">
          {title}
        </Text>

        <View className="flex flex-row justify-between items-start gap-y-1 p-[0px_10px]">
          {/* price */}
          <View className="flex gap-y-2">
            {buyOrRent === "buy" ? (
              <Text className="text-[20px] font-[poppins-bold]">
                ₹1799{" "}
                <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                  ₹2799
                </Text>
              </Text>
            ) : (
              <Text className="text-[18px] font-[poppins-bold]">
                ₹179
                <Text className="text-[13px] font-[poppins-bold]"> / Day</Text>
              </Text>
            )}
          </View>

          {/* quantity section */}
          <View className="flex flex-col gap-y-2 items-end">
            <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-end">
              <TouchableOpacity
                onPress={() => {}}
                className="rounded-full w-[24px] h-[24px] flex flex items-center justify-center bg-white">
                <AntDesign name="minus" size={15} color="black" />
              </TouchableOpacity>
              <Text className="font-[poppins-bold] text-[15px] mr-4 ml-4">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => {}}
                className="rounded-full w-[22px] h-[22px] flex flex items-center justify-center bg-white">
                <AntDesign name="plus" size={15} color="black" />
              </TouchableOpacity>
            </View>

            {!buyOrRent === "rent" && (
              <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                <TouchableOpacity
                  onPress={() => {
                    setRentDays((prev) => (prev == 1 ? 1 : prev - 1));
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="minus" size={15} color="black" />
                </TouchableOpacity>

                <Text className="font-[poppins-xbold] text-[18px] mr-4 ml-4">
                  {rentDays}
                  {"  "}
                  <Text className="font-[poppins-bold] text-[15px]">Day</Text>
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setRentDays((prev) => (prev >= 50 ? 50 : prev + 1));
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="plus" size={10} color="black" />
                </TouchableOpacity>
              </View>
            )}

            {/* <View>
            {availableStocks === 0 || quantity > availableStocks ? (
              <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                Out of stock
              </Text>
            ) : (
              <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                ({availableStocks} items) In stock
              </Text>
            )}
          </View> */}
          </View>
        </View>
      </View>
    </View>
  );
}

export default CartItem;
