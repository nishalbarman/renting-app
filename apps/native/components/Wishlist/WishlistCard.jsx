import React, { memo, useMemo, useState } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDeleteWishlistMutation } from "@store/rtk/apis/wishlistApi";
import AnimateSpin from "../AnimateSpin/AnimateSpin";

function Product({
  details: {
    _id,
    previewUrl,
    title,
    category,
    isRentable,
    isPurchasable,
    rentingPrice,
    discountedPrice,
    originalPrice,
    showPictures,
    description,
    stars,
    totalFeedbacks,
    shippingPrice,
    isSizeVaries,
    isColorVaries,
    availableVarients,
    availableSizes,
    availableColors,
  },
  width,
}) {
  const router = useRouter();

  const [removeFromWishlist, { isLoading }] = useDeleteWishlistMutation();

  const loadingBlurHash = useMemo(() => {
    return "LKO2?Z~W9Zj[%";
  }, []);

  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const handleRemoveFromWishlist = async () => {
    try {
      console.log("Clicking");
      const resPayload = await removeFromWishlist({ _id: _id }).unwrap();
      console.log("Remove from wishlist response -->", resPayload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductClick = () => {
    router.push(`/product?id=${_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleProductClick}
      activeOpacity={0.6}
      className={`relative border-[1px] border-[#F0F3F4] flex flex-col h-fit ${width ? `w-[${width}]` : "w-[150px]"} flex-1 mb-[0.5px] bg-white rounded-md shadow-sm pb-[1%]`}>
      <View className="w-[100%] h-[200px] p-[3%] ">
        {(isRentable && isPurchasable) || (
          <Text
            style={{
              backgroundColor: isRentable ? "red" : "#41a63f",
            }}
            className="bg-[#41a63f] text-white rounded-[10px] p-[4px_10px] absolute top-2 left-2 z-[1] text-[11px] font-extrabold uppercase">
            {isPurchasable ? "Buy" : "Rent"}
          </Text>
        )}

        {/* <TouchableHighlight
          underlayColor={"rgba(0,0,0,0.1)"}
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
          onPress={handleAddToWishlist}
          className="absolute top-2 right-3 h-10 w-10 rounded-full items-center justify-center z-[1]">
          {onCart ? (
            <FontAwesome name="heart" size={19} color={"red"} />
          ) : (
            <FontAwesome name="heart-o" size={19} color={"black"} />
          )}
        </TouchableHighlight> */}

        <TouchableHighlight
          underlayColor={"rgba(0,0,0,0.6)"}
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
          onPress={handleRemoveFromWishlist}
          className="absolute top-2 right-3 h-10 w-10 rounded-full items-center justify-center z-[1]">
          {isLoading ? (
            <AnimateSpin>
              <EvilIcons name="spinner" size={24} color="white" />
            </AnimateSpin>
          ) : (
            <MaterialIcons name="delete-outline" size={23} color="white" />
          )}
        </TouchableHighlight>

        <Image
          style={{ height: 200 }}
          className="w-[100%] h-[200px] bg-[transparent] rounded-lg flex-1"
          source={{ uri: previewUrl }}
          contentFit="contain"
          contentPosition={"center"}
          onError={(error) => console.error("Image load error:", error)}
          loadingBlurHash={loadingBlurHash}
        />
      </View>

      <View className="flex flex-col gap-y-1 w-[100%] mt-[5px] pl-2 pr-2 pb-2">
        <Text
          numberOfLines={2}
          className="text-[14px] font-[poppins-mid] leading-[22px] w-[100%]">
          {title}
        </Text>

        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center justify-center h-fill">
            {starsArray.map((item, index) => {
              return (
                <AntDesign
                  key={index}
                  onPress={() => {
                    setCurrentUserReview(index + 1);
                  }}
                  name={index + 1 <= Math.round(stars) ? "star" : "staro"}
                  size={18}
                  color={index + 1 <= Math.round(stars) ? "orange" : "black"}
                />
              );
            })}
          </View>
          <Text className="ml-1 text-[#A7A6A7] text-[13px] align-middle">
            ({totalFeedbacks})
          </Text>
        </View>

        {isPurchasable && isRentable ? (
          <View className="flex flex-col gap-y-[0.8px]">
            {/* <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
              ₹{rentingPrice}{" "}
              <Text className="text-[13px] align-middle">/ Day</Text>
            </Text>
            <Text className="text-[10px] font-[poppins-bold]"> OR </Text>
            <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
              ₹{discountedPrice}
              {"  "}
              {originalPrice && (
                <Text className="text-[13px] text-[#727273] line-through line-offset-[2px]">
                  ₹{originalPrice}
                </Text>
              )}
            </Text> */}
          </View>
        ) : isRentable ? (
          <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
            ₹{rentingPrice}{" "}
            <Text className="text-[13px] align-middle">/ Day</Text>
          </Text>
        ) : (
          <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
            ₹{discountedPrice}
            {"  "}
            {originalPrice && (
              <Text className="text-[13px] text-[#727273] line-through line-offset-[2px]">
                ₹{originalPrice}
              </Text>
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(Product);
