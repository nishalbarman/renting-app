import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RadioGroup from "react-native-radio-buttons-group";

export default function Page() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedId, setSelectedId] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const data = [
    {
      id: 0,
      outerStyle: {
        width: 50,
        height: 50,
        borderColor: "black",
        borderRadius: 25,
      },
      innerStyle: {
        borderRadius: 25,
      },
      color: "black",
      value: "black",
    },
    {
      id: 1,
      outerStyle: {
        width: 50,
        height: 50,
        borderColor: "#FB4009",
        borderRadius: 25,
      },
      innerStyle: {
        borderRadius: 25,
      },
      color: "#FB4009",
      value: "red",
    },
    {
      id: 2,
      outerStyle: {
        width: 50,
        height: 50,
        borderColor: "#F6800F",
        borderRadius: 25,
      },
      innerStyle: {
        borderRadius: 25,
      },
      color: "#F6800F",
      value: "yellow",
    },
    {
      id: 4,
      outerStyle: {
        width: 50,
        height: 50,
        borderColor: "#F4A012",
        borderRadius: 25,
      },
      innerStyle: {
        borderRadius: 25,
      },
      color: "#F4A012",
      value: "red",
    },
    {
      id: 5,
      outerStyle: {
        width: 50,
        height: 50,
        borderColor: "#F0E017",
        borderRadius: 25,
      },
      innerStyle: {
        borderRadius: 25,
      },
      color: "#F0E017",
      value: "blue",
    },
  ];

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="w-[100%] p-[5px]">
          <Carousel
            pagingEnabled={true}
            width={width}
            height={width}
            autoPlay={false}
            data={productDetails.showPictures}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log("current index:", index)}
            renderItem={({ index }) => {
              return (
                <Image
                  className="bg-white w-[100%] h-[100%]"
                  source={{ uri: productDetails.showPictures[index] }}
                  contentFit="contain"
                  contentPosition={"center"}
                />
              );
            }}
          />
        </View>
        <View className="flex flex-1 p-[12px] flex-col gap-3">
          <Text className="font-[mrt-mid] leading-[21px] text-grey text-[15px]">
            ZEBRONICS ZIUM Mid-Tower gaming cabinet, M-ATX/M-Itx, Fins Foccussed
            Multicolor Rear Fan, Multi Color Led Strip, Acryflic Glass Side
            Panel, USB 3.0, USB 2.0
          </Text>
          <Text className="font-[mrt-mid] leading-[20px] text-grey text-[15px]">
            ⭐ {productDetails.stars}{" "}
            <Text className="text-[#787878]">
              ({productDetails.totalFeedbacks})
            </Text>
          </Text>

          <View>
            <View className="flex flex-row justify-between items-center gap-y-1">
              <View className="flex gap-y-2">
                <Text className="text-[25px] font-[mrt-bold]">
                  ₹1799{" "}
                  <Text className="text-[15px] text-[#787878] font-[mrt] line-through">
                    ₹2799
                  </Text>
                </Text>

                {/* <Text className="text-[20px] font-[mrt-bold]">
                  ₹179
                  <Text className="text-[15px] font-[mrt-bold]"> / perday</Text>
                </Text> */}

                <View className="">
                  <View className="flex flex-row justify-end p-1 w-[50px] rounded-[15px] mt-2 border-[1px] border-[#a8a8a8]">
                    {/* <View className="w-[20px] h-[20px] rounded-full bg-[#339c39]"></View> */}
                    <View className="w-[20px] h-[20px] rounded-full bg-[#d91111]"></View>
                  </View>
                </View>
              </View>

              <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px]">
                <TouchableOpacity
                  onPress={() => {
                    setQuantity((prev) => (prev == 1 ? 1 : prev - 1));
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="minus" size={29} color="black" />
                </TouchableOpacity>
                <Text className="font-[mrt-xbold] mr-4 ml-4">{quantity}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setQuantity((prev) => prev + 1);
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex flex-col pt-2">
            {/* // size section */}
            <View className="flex flex-col pb-2">
              <Text className="text-[17px] font-[mrt]">
                Size: <Text className="uppercase font-[mrt-bold]">S</Text>
              </Text>
              <FlatList
                horizontal
                data={["S", "M", "L", "XL", "S", "M", "L"]}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity className="w-[50px] h-[50px] rounded-lg m-2 flex items-center justify-center shadow-sm">
                    {/* bg-[#343434]  */}
                    <Text className="text-[15px] font-[mrt-bold]">{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            {/* // Colors section */}
            <View className="flex flex-col pb-2">
              <Text className="text-[17px] font-[mrt]">
                Color:{" "}
                <Text className="uppercase font-[mrt-bold]">
                  {data[setSelectedId - 1]?.value}
                </Text>
              </Text>

              <RadioGroup
                inital={0}
                layout="row"
                radioButtons={data}
                onPress={(item) => {
                  console.log(item);
                  setSelectedId(item);
                }}
                selectedId={selectedId}
                containerStyle={{
                  marginRight: 10,
                  marginTop: 10,
                  padding: 0,
                }}
              />
            </View>
          </View>

          <View className="mt-3">
            <Text className="text-[15px] text-[#32a852] font-[mrt-bold]">
              In stock
            </Text>
            <Text className="text-[15px] text-[#d12626] font-[mrt-bold]">
              Out of stock
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
