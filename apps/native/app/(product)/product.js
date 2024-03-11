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
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

export default function Page() {
  const [toogleSale, setToogleSale] = useState(true);

  const [selectedProductSize, setSelectedProductSize] = useState("S");
  const [selectedProductColor, setSelectedProductColor] = useState("red");

  const [selectedId, setSelectedId] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [availableStocks] = useState(10);

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

        {/* product body */}
        <View className="flex flex-1 p-[12px] flex-col gap-3">
          <Text className="font-[mrt-mid] leading-[21px] text-grey text-[15px]">
            ZEBRONICS ZIUM Mid-Tower gaming cabinet, M-ATX/M-Itx, Fins Foccussed
            Multicolor Rear Fan, Multi Color Led Strip, Acryflic Glass Side
            Panel, USB 3.0, USB 2.0
          </Text>

          {/* rating and start */}
          <Text className="font-[mrt-mid] leading-[20px] text-grey text-[15px]">
            ⭐ {productDetails.stars}{" "}
            <Text className="text-[#787878]">
              ({productDetails.totalFeedbacks})
            </Text>
          </Text>

          {/* size and color section */}
          <View className="flex flex-col rounded-[10px] shadow bg-[#ededed] p-2 justify-center">
            <View className="bg-white rounded-[10px] p-4 pt-5 pb-5">
              {/* // size section */}
              <View className="flex flex-col pb-4 gap-y-2">
                <Text className="text-[17px] font-[mrt]">
                  Size:{" "}
                  <Text className="uppercase font-[mrt-bold] text-[16px]">
                    {selectedProductSize}
                  </Text>
                </Text>
                <FlatList
                  horizontal
                  data={["S", "M", "L", "XL"]}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProductSize(item);
                      }}
                      style={{
                        backgroundColor:
                          selectedProductSize === item ? "#9470B5" : "white",
                      }}
                      className="w-[40px] h-[40px] rounded-lg m-2 flex items-center justify-center shadow-sm text-white">
                      <Text
                        style={{
                          color:
                            selectedProductSize === item ? "white" : "black",
                        }}
                        className="text-[15px] font-[mrt-bold]">
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>

              {/* // Colors section */}
              <View className="flex flex-col pb-2 gap-y-2">
                <Text className="text-[17px] font-[mrt]">
                  Color:{" "}
                  <Text className="uppercase font-[mrt-bold] text-[16px]">
                    {selectedProductColor}
                  </Text>
                </Text>

                <FlatList
                  horizontal
                  data={[
                    "red",
                    "blue",
                    "green",
                    "black",
                    "white",
                    "blue",
                    "green",
                    "black",
                    "white",
                    "blue",
                    "green",
                    "black",
                    "white",
                    "blue",
                    "green",
                    "black",
                    "white",
                    "blue",
                    "green",
                    "black",
                    "white",
                  ]}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProductColor(item);
                      }}
                      style={{
                        backgroundColor: item,
                        // opacity: item === selectedProductColor ? 0.2 : 1,
                      }}
                      className={`w-[39px] h-[39px] rounded-lg m-2 flex items-center justify-center shadow-sm text-white ${selectedProductColor === item && "rounded-full"}`}>
                      {/* <AntDesign name="pushpino" size={24} color={"black"} /> */}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>

          {/* price and quantity section */}
          <View>
            <View className="flex flex-row justify-between items-center gap-y-1 p-[0px_10px]">
              <View className="flex gap-y-2">
                {toogleSale ? (
                  <Text className="text-[30px] font-[mrt-bold]">
                    ₹1799{" "}
                    <Text className="text-[15px] text-[#787878] font-[mrt] line-through">
                      ₹2799
                    </Text>
                  </Text>
                ) : (
                  <Text className="text-[30px] font-[mrt-bold]">
                    ₹179
                    <Text className="text-[15px] font-[mrt-bold]"> / Day</Text>
                  </Text>
                )}

                <View className="">
                  <TouchableOpacity
                    onPress={() => {
                      setToogleSale((prev) => !prev);
                    }}
                    className="flex flex-row items-center p-1 w-[73px] rounded-[15px] mt-2 border-[1px] border-[#a8a8a8]">
                    {toogleSale ? (
                      <>
                        <View className="self-start w-[20px] h-[20px] rounded-full bg-[#339c39]"></View>
                        <Text className="pr-2"> Buy</Text>
                      </>
                    ) : (
                      <>
                        <View className="self-end w-[20px] h-[20px] rounded-full bg-[#d91111]"></View>
                        <Text className="pr-2"> Rent</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                  <TouchableOpacity
                    onPress={() => {
                      setQuantity((prev) => (prev == 1 ? 1 : prev - 1));
                    }}
                    className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                    <AntDesign name="minus" size={29} color="black" />
                  </TouchableOpacity>
                  <Text className="font-[mrt-xbold] text-[18px] mr-4 ml-4">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setQuantity((prev) => prev + 1);
                    }}
                    className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                    <AntDesign name="plus" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="mt-3">
                  {availableStocks === 0 || quantity > availableStocks ? (
                    <Text className="text-[13px] text-[#d12626] font-[mrt-bold]">
                      Out of stock
                    </Text>
                  ) : (
                    <Text className="text-[13px] text-[#32a852] font-[mrt-bold]">
                      ({availableStocks} items) In stock
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* product description */}
          <View>
            <WebView source={{ uri: "http://google.com" }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
