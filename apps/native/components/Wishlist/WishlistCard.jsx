import React, { memo, useMemo } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AntDesign, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDeleteWishlistMutation } from "@store/rtk/apis/wishlistApi";
import AnimateSpin from "../AnimateSpin/AnimateSpin";

import { Toast } from "toastify-react-native";

function Product({ wishlistId, details, width, productType }) {
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
      const resPayload = await removeFromWishlist({
        _id: wishlistId,
      }).unwrap();
      Toast.success("Wishlist removed", "bottom");
      // console.log("Remove from wishlist response -->", resPayload);
    } catch (error) {
      Toast.success("Wishlist remove failed", "bottom");
      console.error(error);
    }
  };

  const handleProductClick = () => {
    router.push(`/view?id=${details._id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleProductClick}
      activeOpacity={0.6}
      className={`relative border-[1px] border-[#F0F3F4] flex flex-col h-fit ${width ? `w-[${width}]` : "w-[150px]"} flex-1 mb-[0.5px] bg-white rounded-md shadow-sm pb-[1%]`}>
      <View className="w-[100%] h-[200px] p-[3%] ">
        {details.productType === "both" || (
          <Text
            style={{
              backgroundColor:
                details.productType === "rent" ? "red" : "#41a63f",
            }}
            className="bg-[#41a63f] text-white rounded-[10px] p-[4px_10px] absolute top-2 left-2 z-[1] text-[11px] font-extrabold uppercase">
            {details.productType === "buy" ? "Buy" : "Rent"}
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
          source={{ uri: details.previewImage }}
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
          {details.title}
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
                  name={
                    index + 1 <= Math.round(details.stars) ? "star" : "staro"
                  }
                  size={18}
                  color={
                    index + 1 <= Math.round(details.stars) ? "orange" : "black"
                  }
                />
              );
            })}
          </View>
          <Text className="ml-1 text-[#A7A6A7] text-[13px] align-middle">
            ({details.totalFeedbacks})
          </Text>
        </View>

        {details.productType === "both" ? (
          <>
            {productType === "rent" ? (
              <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
                ₹{details.rentingPrice}{" "}
                <Text className="text-[13px] align-middle">/ Day</Text>
              </Text>
            ) : (
              <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
                ₹{details.discountedPrice}
                {"  "}
                {details.originalPrice && (
                  <Text className="text-[13px] text-[#727273] line-through line-offset-[2px]">
                    ₹{details.originalPrice}
                  </Text>
                )}
              </Text>
            )}
          </>
        ) : details.productType === "rent" ? (
          <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
            ₹{details.rentingPrice}{" "}
            <Text className="text-[13px] align-middle">/ Day</Text>
          </Text>
        ) : (
          <Text className="font-[poppins-bold] text-[16px] align-middle leading-[30px] text-black">
            ₹{details.discountedPrice}
            {"  "}
            {details.originalPrice && (
              <Text className="text-[13px] text-[#727273] line-through line-offset-[2px]">
                ₹{details.originalPrice}
              </Text>
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default Product;
