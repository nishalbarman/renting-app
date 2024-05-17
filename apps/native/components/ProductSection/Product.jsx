import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  useAddWishlistMutation,
  useDeleteWishlistMutation,
  useGetWishlistQuery,
} from "@store/rtk";

import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

function Product({
  details: {
    _id,
    previewImage,
    title,
    category,
    productType: typeOfProduct,
    rentingPrice,
    discountedPrice,
    originalPrice,
    slideImages,
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
  wishlistIdMap,
  feedbackVisible = true,
}) {
  const router = useRouter();

  const { productType } = useSelector((state) => state.product_store);

  const [addWishlist] = useAddWishlistMutation();

  const [onWishlist, setOnWishlist] = useState(false);

  useEffect(() => {
    setOnWishlist(!!wishlistIdMap?.hasOwnProperty(_id));
  }, [wishlistIdMap]);

  const loadingBlurHash = useMemo(() => {
    return "LKO2?Z~W9Zj[%";
  }, []);

  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const { refetch } = useGetWishlistQuery();
  const [removeFromWishlist] = useDeleteWishlistMutation();

  const handleRemoveFromWishlist = async () => {
    try {
      setOnWishlist(false);
      const wishlistItemID = wishlistIdMap[_id];
      const resPayload = await removeFromWishlist({
        _id: wishlistItemID,
      }).unwrap();

      Toast.show({
        type: "sc",
        text1: "Wishlist removed",
      });
    } catch (error) {
      Toast.show({
        type: "err",
        text1: "Wishlist remove failed",
      });
      setOnWishlist(true);
      console.error(error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setOnWishlist((prev) => !prev);
      const resPayload = await addWishlist({ id: _id, productType }).unwrap();

      Toast.show({
        type: "sc",
        text1: "Wishlist added",
      });
    } catch (error) {
      Toast.show({
        type: "err",
        text1: "Wishlist add failed",
      });
      console.error(error);
    }
  };

  const handleLoveIconClick = () => {
    if (!!wishlistIdMap?.hasOwnProperty(_id)) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }

    refetch();
  };

  const handleProductClick = () => {
    router.navigate({
      pathname: "view",
      params: {
        id: _id,
      },
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleProductClick}
        activeOpacity={0.6}
        className={`relative border border-gray-100 flex flex-col h-fit ${width ? "w-[" + width + "]" : "w-[150px]"} flex-1 mb-[0.5px] bg-transparent rounded-md pb-[1%]`}>
        {/* border-[#F0F3F4] */}
        {/* shadow-sm  */}
        <View className="w-[100%] h-[200px] p-[3%] ">
          {typeOfProduct === "both" || (
            <Text
              style={{
                backgroundColor: typeOfProduct === "rent" ? "red" : "#41a63f",
              }}
              className="bg-[#41a63f] text-white rounded-[10px] p-[4px_10px] absolute top-2 left-2 z-[1] text-[11px] font-extrabold uppercase">
              {typeOfProduct === "buy" ? "Buy" : "Rent"}
            </Text>
          )}

          <TouchableHighlight
            underlayColor={"rgba(0,0,0,0.1)"}
            // style={{
            //   backgroundColor: "rgba(0,0,0,0.1)",
            // }}
            onPress={handleLoveIconClick}
            className="absolute top-2 items-center justify-center right-3 h-10 w-10 rounded-full z-[1]">
            {onWishlist ? (
              <FontAwesome name="heart" size={19} color={"green"} />
            ) : (
              <FontAwesome name="heart-o" size={19} color={"black"} />
            )}
          </TouchableHighlight>

          <Image
            style={{ height: 200 }}
            className="w-[100%] h-[200px] bg-transparent rounded-lg flex-1 bg-white"
            source={{ uri: previewImage }}
            contentFit="contain"
            contentPosition={"center"}
            onError={(error) => console.error("Image load error:", error)}
            loadingBlurHash={loadingBlurHash}
          />
        </View>

        <View className="flex flex-col gap-y-1 w-[100%] mt-[5px] pl-2 pr-2 pb-2">
          <Text
            numberOfLines={2}
            className="text-[13px] leading-[18px] tracking-wider text-gray-800 font-[roboto-bold] w-[100%]">
            {title}
          </Text>

          {!!feedbackVisible && (
            <View className="flex flex-row items-center">
              <View className="flex flex-row items-center justify-center h-fill">
                {starsArray.map((item, index) => {
                  return (
                    <AntDesign
                      key={index}
                      name={index + 1 <= Math.round(stars) ? "star" : "staro"}
                      size={18}
                      color={
                        index + 1 <= Math.round(stars) ? "orange" : "black"
                      }
                    />
                  );
                })}
              </View>
              <Text className="ml-1 text-[#A7A6A7] text-[13px]">
                ({totalFeedbacks})
              </Text>
            </View>
          )}

          {typeOfProduct === "both" ? (
            <>
              {productType === "rent" ? (
                <View className="flex-row items-center flex-wrap justify-start my-1">
                  <Text className="font-[roboto-mid] text-[16px] text-black">
                    ₹{rentingPrice}
                  </Text>
                  <Text className="text-[12px] tracking-[0.1px] font-[roboto]">
                    {" "}
                    / Day
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center flex-wrap justify-start my-1">
                  <Text className="font-[roboto-mid] text-[16px] text-black">
                    ₹{discountedPrice}
                    {"  "}
                  </Text>
                  {originalPrice && originalPrice !== discountedPrice && (
                    <Text className="text-[13px] font-mid text-[#727273] line-through line-offset-[2px]">
                      ₹{originalPrice}
                    </Text>
                  )}
                </View>
              )}
            </>
          ) : typeOfProduct === "rent" ? (
            <Text className="font-[roboto-mid] text-[16px] leading-[30px] text-black">
              ₹{rentingPrice}
              <Text className="text-[12px] font-[roboto-light]">/ Day</Text>
            </Text>
          ) : (
            <View className="flex-row items-center flex-wrap justify-start my-1">
              <Text className="font-[roboto-mid] text-[16px] text-black">
                ₹{discountedPrice}
                {"  "}
              </Text>
              {originalPrice && (
                <Text className="text-[13px] font-mid text-[#727273] line-through line-offset-[2px]">
                  ₹{originalPrice}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
}

export default Product;
