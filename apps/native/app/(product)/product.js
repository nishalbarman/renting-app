import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const width = Dimensions.get("window").width;

  const productDetails = {
    previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
    title: "DSG mens DSG RACE PRO V2 JACKET",
    category: { _id: "random_id_32423", name: "Biking" },
    isPurchasable: true,
    rentingPrice: 100,
    discountedPrice: 11000,
    originalPrice: 23131,
    showPictures: [
      "https://m.media-amazon.com/images/I/71l6+Wxdg6S._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/5161uV9BXAL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/51bOhEXhdrL._SX679_.jpg",
      "https://m.media-amazon.com/images/I/41QZ7+muJhL._SX679_.jpg",
    ],
    description: `<><p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul></>`,
    stars: 3,
    totalFeedbacks: 223,
    shippingPrice: 5,
    isSizeVaries: true,
    isColorVaries: true,
    availableVarients: [
      {
        color: "Red",
        size: "S",
        rentPrice: 10,
        discountedPrice: 12,
        originalPrice: 10,
      },
    ],
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: ["Red", "Blue", "Black"],
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="w-[100%] p-[5px]">
          <Carousel
            pagingEnabled={true}
            width={width}
            height={width / 2}
            autoPlay={false}
            data={productDetails.showPictures}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log("current index:", index)}
            renderItem={({ index }) => {
              return (
                <Image
                  className="bg-white w-[100%] h-[100%]"
                  source={{ uri: productDetails.showPictures[index] }}
                  contentFit="scale-down"
                  contentPosition={"center"}
                />
              );
            }}
          />
        </View>
        <View className="flex flex-1 p-[10px]">
          <Text>Hi I am Nishal barman</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
