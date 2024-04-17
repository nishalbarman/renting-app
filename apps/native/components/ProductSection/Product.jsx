import React, { memo, useEffect, useMemo, useState } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAddWishlistMutation, useDeleteWishlistMutation } from "@store/rtk";

import { useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

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
}) {
  const router = useRouter();

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

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

  const [removeFromWishlist] = useDeleteWishlistMutation();

  const handleRemoveFromWishlist = async () => {
    try {
      setOnWishlist(false);
      const wishlistItemID = wishlistIdMap[_id];
      const resPayload = await removeFromWishlist({
        _id: wishlistItemID,
      }).unwrap();

      Toast.success("Wishlist removed", "bottom");

      console.log("Remove from wishlist response -->", resPayload);
    } catch (error) {
      Toast.success("Wishlist remove failed", "bottom");
      setOnWishlist(true);
      console.error(error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setOnWishlist((prev) => !prev);
      const resPayload = await addWishlist({ id: _id, productType }).unwrap();
      console.log("Add to Wishlist response -->", resPayload);
      Toast.success("Wishlist added", "bottom");
    } catch (error) {
      Toast.success("Wishlist add failed", "bottom");
      console.error(error);
    }
  };

  const handleLoveIconClick = () => {
    console.log(!!wishlistIdMap?.hasOwnProperty(_id));

    if (!!wishlistIdMap?.hasOwnProperty(_id)) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  const handleProductClick = () => {
    router.push({
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
        className={`relative border-[1px] border-[#F0F3F4] flex flex-col h-fit ${width ? `w-[${width}]` : "w-[150px]"} flex-1 mb-[0.5px] bg-white rounded-md shadow-sm pb-[1%]`}>
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
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
            onPress={handleLoveIconClick}
            className="absolute top-2 right-3 h-10 w-10 rounded-full items-center justify-center z-[1]">
            {onWishlist ? (
              <FontAwesome name="heart" size={19} color={"red"} />
            ) : (
              <FontAwesome name="heart-o" size={19} color={"black"} />
            )}
          </TouchableHighlight>

          <Image
            style={{ height: 200 }}
            className="w-[100%] h-[200px] bg-[transparent] rounded-lg flex-1 bg-white"
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

          {typeOfProduct === "both" ? (
            <>
              {productType === "rent" ? (
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
            </>
          ) : typeOfProduct === "rent" ? (
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
    </>
  );
}

export default Product;
