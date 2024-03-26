import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

import AnimateSpin from "../AnimateSpin/AnimateSpin";
import { SheetManager } from "react-native-actions-sheet";
import { useDeleteCartMutation } from "@store/rtk/apis/cartApi";
import { useAddWishlistMutation } from "@store/rtk/apis/wishlistApi";

function CartCard({
  cart: {
    _id,
    product,
    variant,
    quantity,
    productType,
    rentDays,
    discountedPrice,
    originalPrice,
    rentingPrice,
    shippingPrice,
    freeDelivery,
  },
}) {
  const rentTotalTimeRemaining = useMemo(() => {
    const returnDate = new Date("2024-03-15T13:41:55.646+00:00");
    const today = new Date();

    console.log(returnDate.getTime(), today.getTime());
    // Calculating the time difference
    // of two dates
    let Difference_In_Time = returnDate.getTime() - today.getTime();
    console.log(Difference_In_Time);
    // // Calculating the no. of days between
    // // two dates
    let totalTimeRemaining = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    console.log(totalTimeRemaining);
    return totalTimeRemaining;
  }, []);

  const [removeFromCart, { isLoading: cartRemoveLoading }] =
    useDeleteCartMutation();

  const handleRemoveFromCart = async () => {
    try {
      const response = await removeFromCart(_id).unwrap();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const [addWishlist, { isLoading: isWishlistAddLoading }] =
    useAddWishlistMutation();

  const handleMoveWishlist = async () => {
    try {
      // setOnCart((prev) => !prev);
      if (!product?._id) return;
      const resPayload = await Promise.all([
        addWishlist({ id: product._id }).unwrap(),
        handleRemoveFromCart(),
      ]).then((res) => console.log(res));
    } catch (error) {
      console.error(error);
    }
  };

  const [changedRentDays, setRentDays] = useState(0);
  const [changedQuantity, setQuantity] = useState(0);

  useEffect(() => {
    setRentDays(rentDays);
    setQuantity(quantity);
  }, [rentDays, quantity]);

  return (
    <View className="bg-white shadow p-2 pb-4 pt-4 rounded-md mb-[10px] w-full border border-gray-300">
      <View className={`flex-row p-1 gap-x-5`}>
        <Image
          source={{
            uri: product?.previewUrl,
          }}
          className={`w-[100px] aspect-square self-center rounded`}
          contentFit="contain"
          contentPosition={"center"}
        />

        <View className={`ml-3 flex-1`}>
          <Text
            numberOfLines={2}
            className={`text-lg font-semibold flex-wrap leading-[25px]`}>
            {product?.title}
          </Text>
          <View className="mt-2">
            {!!variant?.color && (
              <View className={`flex-row`}>
                <Text className={`text-[#5e5e5e]`}>Color:</Text>
                <Text className={`ml-1`}>{variant?.color}</Text>
              </View>
            )}

            <View className={`flex-row mt-1`}>
              <Text className={`text-[#5e5e5e]`}>Qty:</Text>
              <Text className={`ml-1`}>{quantity}</Text>
            </View>

            {/* {productType === "rent" && (
              <View className={`flex-row mt-1`}>
                <Text className={`text-[#5e5e5e]`}>Days:</Text>
                <Text className={`ml-1`}>{rentDays}</Text>
              </View>
            )} */}

            {!!variant?.size && (
              <View className={`flex-row mt-1`}>
                <Text className={`text-[#5e5e5e]`}>Size:</Text>
                <Text className={`ml-1`}>{variant?.size}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="flex flex-row justify-between items-start gap-y-1 p-[0px_10px]">
        {/* price */}
        <View className="flex gap-y-2 basis-1/2">
          {productType === "buy" ? (
            <>
              <Text className="text-[20px] font-[poppins-bold]">
                ₹{variant?.discountedPrice || discountedPrice}{" "}
                <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                  ₹{variant?.originalPrice || originalPrice}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text className="text-[18px] font-[poppins-bold]">
                ₹{variant?.rentingPrice || rentingPrice}
                <Text className="text-[13px] font-[poppins-bold]"> / Day</Text>
              </Text>
            </>
          )}

          <Text className="text-[13px] leading-2">
            Shipping price: ₹{variant?.shippingPrice || shippingPrice}
            {!freeDelivery && "\n\nFREE shipping above 500"}
          </Text>
        </View>

        {/* quantity section */}
        <View className="flex flex-col gap-y-2 items-end">
          <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-end">
            <TouchableOpacity
              onLongPress={() => {
                setQuantity(1);
              }}
              onPress={() => {
                setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
              }}
              className="rounded-full w-[24px] h-[24px] flex flex items-center justify-center bg-white">
              <AntDesign name="minus" size={15} color="black" />
            </TouchableOpacity>
            <Text className="font-[poppins-bold] text-[15px] mr-4 ml-4">
              {changedQuantity}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setQuantity((prev) => prev + 1);
              }}
              className="rounded-full w-[22px] h-[22px] flex flex items-center justify-center bg-white">
              <AntDesign name="plus" size={15} color="black" />
            </TouchableOpacity>
          </View>

          {productType === "rent" && (
            <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-end">
              <TouchableOpacity
                onLongPress={() => {
                  setRentDays(1);
                }}
                onPress={() => {
                  setRentDays((prev) => (prev === 1 ? 1 : prev - 1));
                }}
                className="rounded-full w-[24px] h-[24px] flex flex items-center justify-center bg-white">
                <AntDesign name="minus" size={15} color="black" />
              </TouchableOpacity>
              <Text className="font-[poppins-bold] text-[15px] mr-4 ml-4">
                {changedRentDays} <Text className="text-[12px]">/ Days</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setRentDays((prev) => (prev == 50 ? 50 : prev + 1));
                }}
                className="rounded-full w-[22px] h-[22px] flex flex items-center justify-center bg-white">
                <AntDesign name="plus" size={15} color="black" />
              </TouchableOpacity>
            </View>
          )}

          <View>
            {variant.availableStocks === 0 ||
            product.availableStocks === 0 ||
            quantity > (variant.availableStocks || product.availableStocks) ? (
              <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                Out of stock
              </Text>
            ) : (
              <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                ({variant.availableStocks || product.availableStocks} items) In
                stock
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* {orderType === "rent" && (
        <View className="flex-row items-center justify-start mt-4 mb-1">
          <AntDesign name="infocirlce" size={22} color="#349fd9" />
          <Text className="text-[15px] text-[#349fd9] leading-[20px] text-wrap pl-2 pr-4">
            {rentTotalTimeRemaining < 0
              ? "Due date for returning has exceeded already, you will be charged with some penalty amount"
              : rentTotalTimeRemaining > 0
                ? rentReturnDueDate + "Days remaining to return"
                : "Today is the due date to return the ordered item."}
          </Text>
        </View>
      )} */}

      {/* <Text className="bg-[#ffe9d6] text-[#bf6415] border border-[#bf6415] rounded-md text-[10px] pt-[7px] pb-[7px] pl-[2px] pr-[2px] text-center align-middle mt-5 ml-2 mr-2 mb-1 uppercase font-extrabold">
        {orderType === "rent" ? "Rented" : "Bought"}
      </Text> */}

      <View className="flex-row mt-3 justify-between">
        <TouchableHighlight
          onPress={handleMoveWishlist}
          underlayColor={"#514FB6"}
          className="bg-[#514FB6] pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg w-[48%]">
          {isWishlistAddLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="white" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-lg text-white">
              Move Wishlist
            </Text>
          )}
        </TouchableHighlight>
        <View className="w-[4%]"></View>
        <TouchableHighlight
          underlayColor={"white"}
          onPress={handleRemoveFromCart}
          className="bg-white border border-gray-400 pl-2 pr-2 h-[45px] flex items-center justify-center rounded-lg w-[48%]">
          {cartRemoveLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="black" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-lg">Remove</Text>
          )}
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default CartCard;
