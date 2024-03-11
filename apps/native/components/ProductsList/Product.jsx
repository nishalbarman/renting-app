import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

function Product({
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

  width,
}) {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const router = useRouter();

  const [onCart, setOnCart] = useState(false);

  const handleAddToWishlist = () => {
    setOnCart((prev) => !prev);
  };

  const handleProductClick = () => {
    router.push(`/product?id=${_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleProductClick}
      activeOpacity={0.6}
      className={`relative border-[1px] border-[#F0F3F4] flex flex-col h-fit ${width ? `w-[${width}]` : "w-[150px]"} flex-1 mb-[0.5px] bg-white p-[3%] rounded-lg m-1 shadow-sm pb-[20px]`}>
      {(isRentable && isPurchasable) || (
        <Text
          style={{
            backgroundColor: isRentable ? "red" : "#41a63f",
          }}
          className="bg-[#41a63f] text-white rounded-[10px] p-[4px_10px] absolute top-2 left-2 z-[1] text-[10px] font-[mrt-xbold] uppercase">
          {isPurchasable ? "for sale" : "for rent"}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleAddToWishlist}
        className="absolute top-2 right-3 shadow bg-white p-3 rounded-full w-fit h-fit flex flex-col items-center justify-center z-[1]">
        {onCart ? (
          <FontAwesome name="heart" size={20} color={"black"} />
        ) : (
          <FontAwesome name="heart-o" size={20} color={"black"} />
        )}
      </TouchableOpacity>

      <Image
        // style={{ width: 150, height: 200 }}
        className="w-[100%] h-[200px] bg-[transparent] rounded-lg flex-1"
        source={{ uri: previewUrl }}
        contentFit="contain"
        contentPosition={"center"}
        onError={(error) => console.error("Image load error:", error)}
      />

      <View className="flex flex-col gap-y-1 w-[100%] mt-[5px]">
        <Text className="text-[13px] text-center p-[5px] font-[mrt-mid] uppercase inline-block w-fit border-dashed border-[1px] border-black mb-[4px]">
          {category?.name}
        </Text>

        <Text className="text-[14px] font-[mrt-bold] leading-[23px] w-[100%] underline">
          {title}
        </Text>
        <Text className="text-[18px] font-[mrt-bold] align-center mb-[5px]">
          ⭐ {stars}{" "}
          <Text className="text-[#A7A6A7] text-[18px] font-[mrt-mid] align-middle">
            ({totalFeedbacks})
          </Text>
        </Text>
        {isPurchasable && isRentable ? (
          <View className="flex flex-col gap-y-[0.8px]">
            <Text className="font-[mrt-bold] text-[17px] align-middle leading-[30px] text-[#1d610e]">
              ₹{rentingPrice}{" "}
              <Text className="text-[15px] align-middle">/ Perday</Text>
            </Text>
            <Text className="text-[14px] font-[mrt-bold]"> OR </Text>
            <Text className="font-[mrt-bold] text-[19px] align-middle leading-[30px] text-[#1d610e]">
              ₹{discountedPrice}
              {"  "}
              {originalPrice && (
                <Text className="text-[15px] text-[#727273] line-through line-offset-[2px]">
                  ₹{originalPrice}
                </Text>
              )}
            </Text>
          </View>
        ) : isRentable ? (
          <Text className="font-[mrt-bold] text-[17px] align-middle leading-[30px] text-[#1d610e]">
            ₹{rentingPrice}{" "}
            <Text className="text-[15px] align-middle">/ Perday</Text>
          </Text>
        ) : (
          <Text className="font-[mrt-bold] text-[17px] align-middle leading-[30px] text-[#1d610e]">
            ₹{discountedPrice}
            {"  "}
            {originalPrice && (
              <Text className="text-[15px] text-[#727273] line-through line-offset-[2px]">
                ₹{originalPrice}
              </Text>
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default Product;
