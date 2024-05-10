import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

import AnimateSpin from "../AnimateSpin/AnimateSpin";
import {
  useDeleteCartMutation,
  useUpdateQuantityCartMutation,
  useUpdateRentDaysCartMutation,
  useAddWishlistMutation,
} from "@store/rtk";
import { useRouter } from "expo-router";

function CartCard({
  cart: {
    _id,
    product,
    variant,
    quantity,
    productType,
    rentDays,
    freeDelivery,
  },
}) {
  const [removeFromCart, { isLoading: cartRemoveLoading }] =
    useDeleteCartMutation();

  const [
    updateRentDaysCart,
    { isLoading: isRentDaysLoading, error: rentDaysError },
  ] = useUpdateRentDaysCartMutation();

  const [
    updateQuantityCart,
    { isLoading: isQuantityLoading, error: quantityError },
  ] = useUpdateQuantityCartMutation();

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

  const [changedRentDays, setRentDays] = useState(-1);
  const [changedQuantity, setQuantity] = useState(-1);

  useEffect(() => {
    setRentDays(rentDays);
    setQuantity(quantity);
  }, [rentDays, quantity]);

  useEffect(() => {
    (async () => {
      console.log(quantity, changedQuantity);
      if (changedQuantity === -1 || changedRentDays === -1) return;
      if (changedQuantity !== quantity) {
        updateQuantityCart({
          id: _id,
          productType: productType,
          quantity: changedQuantity,
        });
      }

      if (changedRentDays !== rentDays) {
        updateRentDaysCart({
          id: _id,
          productType: productType,
          rentDays: changedRentDays,
        });
      }
    })();
  }, [changedQuantity, changedRentDays]);

  const router = useRouter();

  const goToProductPage = () => {
    router.push({
      pathname: "view",
      params: {
        id: product._id,
      },
    });
  };

  return (
    <View
      // onTouchEnd={goToProductPage}
      className="bg-white shadow p-2 pb-4 pt-4 rounded-md mb-[10px] w-full border border-gray-300">
      <View className={`flex-row p-1 gap-x-5`}>
        <Image
          source={{
            uri: product?.previewImage,
          }}
          className={`w-[100px] aspect-square self-center rounded`}
          contentFit="contain"
          contentPosition={"center"}
        />

        <View className={`ml-3 flex-1`}>
          <Text
            numberOfLines={2}
            className={`text-lg font-[poppins-mid] flex-wrap leading-[25px]`}>
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

      <View className="flex flex-row justify-between items-start gap-y-1 px-[10px] mt-1">
        {/* price */}
        <View className="flex gap-y-2 basis-1/2">
          {productType === "buy" ? (
            <>
              <Text className="text-[20px] font-[poppins-bold]">
                ₹{variant?.discountedPrice || product?.discountedPrice}{" "}
                <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                  ₹{variant?.originalPrice || product?.originalPrice}
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Text className="text-[18px] font-[poppins-bold]">
                ₹{variant?.rentingPrice || product?.rentingPrice}
                <Text className="text-[13px] font-[poppins-bold]"> / Day</Text>
              </Text>
            </>
          )}

          <View>
            <Text className="text-[13px] leading-2 font-[poppins]">
              Shipping price: ₹
              {variant?.shippingPrice || product?.shippingPrice}
            </Text>
            {!freeDelivery && (
              <Text className="text-[13px] leading-2 font-[poppins]">
                FREE shipping above 500
              </Text>
            )}
          </View>
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
            {variant?.availableStocks === 0 ||
            product?.availableStocks === 0 ||
            quantity >
              (variant?.availableStocks || product?.availableStocks) ? (
              <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                Out of stock
              </Text>
            ) : (
              <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                ({variant?.availableStocks || product?.availableStocks} items)
                In stock
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row mt-3 justify-between">
        <TouchableHighlight
          onPress={handleMoveWishlist}
          underlayColor={"#b83a21"}
          className="bg-red-700 px-2 h-10 border border-red-700 flex items-center justify-center rounded-lg w-[48%]">
          {isWishlistAddLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="white" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-md text-red-700 text-white font-[poppins]">
              Move Wishlist
            </Text>
          )}
        </TouchableHighlight>
        <View className="w-[4%]"></View>
        <TouchableHighlight
          underlayColor={"white"}
          onPress={handleRemoveFromCart}
          className="bg-white border border-gray-400 px-2 h-10 flex items-center justify-center rounded-lg w-[48%]">
          {cartRemoveLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="black" />
            </AnimateSpin>
          ) : (
            <Text className="font-semibold text-md">Remove</Text>
          )}
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default CartCard;
