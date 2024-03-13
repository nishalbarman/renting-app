import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import HTML from "react-native-render-html";

import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

import FeedbackCard from "../../components/Feedback/FeedbackCard";
import RelatedProductList from "../../components/RelatedProductList/RelatedProductList";
import SearchBar from "../../components/SearchBar/SearchBar";

import AnimatedDotsCarousel from "react-native-animated-dots-carousel";

export default function Page() {
  const { width } = useMemo(() => {
    return Dimensions.get("window");
  }, []);

  const [selectedProductSize, setSelectedProductSize] = useState("S");
  const [selectedProductColor, setSelectedProductColor] = useState("red");

  const [rentDays, setRentDays] = useState(1);

  const [quantity, setQuantity] = useState(1);

  const [currentUserReviewStar, setCurrentUserReviewStar] = useState(1);

  const [availableStocks] = useState(10);

  const reviewSheetModalRef = useRef(null);

  const handlers = useScrollHandlers();

  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const handleReviewSheetOpen = useCallback(() => {
    reviewSheetModalRef.current?.show();
  }, []);

  const productDetails = {
    previewUrl: "https://m.media-amazon.com/images/I/51l2QmdE7PL._SX679_.jpg",
    title:
      "ZEBRONICS ZIUM Mid-Tower gaming cabinet, M-ATX/M-Itx, Fins Foccussed Multicolor Rear Fan, Multi Color Led Strip, Acryflic Glass Side Panel, USB 3.0, USB 2.0",
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
    description: `<p style="line-height: 200%;"><span style="font-size: 18px; color: black;">Our product is the most attractive product that is available on the market. At a very low price rate you can either buy or rent out this procut.</span></p>
    <p><span style="font-size: 20px; color: black;">Features:</span></p>
    <ul>
      <li><span style="font-size: 18px; color: black;">Better price in market</span></li>
      <li><span style="font-size: 18px; color: black;">Good question&nbsp;</span></li>
      <li><span style="font-size: 18px; color: black;">nice explanation</span></li>
      <li><span style="font-size: 18px; color: black;">op means over powered</span></li>
      <li><span style="font-size: 18px; color: black;">omg means oh my god!</span></li>
    </ul>`,
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

  const [toogleSale, setToogleSale] = useState(productDetails.isPurchasable);

  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);

  const handleSubmitReview = () => {};

  const handleTooglePurchaseType = () => {
    if (productDetails.isPurchasable) {
      setToogleSale((prev) => !prev);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView>
        <SearchBar
        // clicked={clicked}
        // searchPhrase={searchPhrase}
        // setSearchPhrase={setSearchPhrase}
        // setClicked={setClicked}
        />

        {/* carousel view */}
        <View className="w-[100%] p-[5px] flex items-center">
          <Carousel
            pagingEnabled={true}
            width={width}
            height={width}
            autoPlay={false}
            data={productDetails.showPictures}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log("current index:", index)}
            onProgressChange={(_, progress) => {
              setCarouselCurrentIndex(Math.ceil(progress));
            }}
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
          <AnimatedDotsCarousel
            length={productDetails.showPictures.length || 0}
            currentIndex={carouselCurrentIndex}
            maxIndicators={4}
            interpolateOpacityAndColor={true}
            activeIndicatorConfig={{
              color: "#b868f2",
              margin: 3,
              opacity: 1,
              size: 8,
            }}
            inactiveIndicatorConfig={{
              color: "#b778e3",
              margin: 3,
              opacity: 0.5,
              size: 8,
            }}
            decreasingDots={[
              {
                config: { color: "#b778e3", margin: 3, opacity: 0.5, size: 6 },
                quantity: 1,
              },
              {
                config: { color: "#b778e3", margin: 3, opacity: 0.5, size: 4 },
                quantity: 1,
              },
            ]}
          />
        </View>

        {/* product body */}
        <View className="flex flex-1 p-[12px] flex-col gap-y-5">
          <Text className="font-[poppins-mid] leading-[103%] text-grey text-[16px]">
            {productDetails.title}
          </Text>
          {/* rating and start */}
          <View className="flex flex-row gap-x-2 items-center">
            <View className="flex flex-row items-center justify-center">
              {starsArray.map((item, index) => {
                return (
                  <AntDesign
                    key={index}
                    onPress={() => {
                      setCurrentUserReviewStar(index + 1);
                    }}
                    name={
                      index + 1 <= Math.round(productDetails.stars)
                        ? "star"
                        : "staro"
                    }
                    size={20}
                    color={
                      index + 1 <= Math.round(productDetails.stars)
                        ? "orange"
                        : "black"
                    }
                  />
                );
              })}
            </View>
            <Text className="text-[#787878]">
              ({productDetails.totalFeedbacks})
            </Text>
          </View>
          {/* size and color section */}
          {/* <View className="flex flex-col rounded-[10px] shadow bg-[#ededed] p-2 justify-center"> */}
          <View className="bg-white rounded-[10px] p-4 pt-5 pb-5 rounded-[10px] shadow-sm bg-[#eadff2]">
            {/* // size section */}
            <View className="flex flex-col pb-4 gap-y-2">
              <Text className="text-[17px] font-[poppins]">
                Size:{" "}
                <Text className="uppercase font-[poppins-bold] text-[16px]">
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
                        color: selectedProductSize === item ? "white" : "black",
                      }}
                      className="text-[15px] font-[poppins-bold]">
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            {/* // Colors section */}
            <View className="flex flex-col pb-2 gap-y-2">
              <Text className="text-[17px] font-[poppins]">
                Color:{" "}
                <Text className="uppercase font-[poppins-bold] text-[16px]">
                  {selectedProductColor}
                </Text>
              </Text>

              <FlatList
                horizontal
                data={["red", "blue", "green", "black"]}
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
          {/* </View> */}

          {/* price and quantity section */}
          <View>
            <View className="flex flex-row justify-between items-center gap-y-1 p-[0px_10px]">
              {/* price */}
              <View className="flex gap-y-2">
                {toogleSale ? (
                  <Text className="text-[30px] font-[poppins-bold]">
                    ₹1799{" "}
                    <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                      ₹2799
                    </Text>
                  </Text>
                ) : (
                  <Text className="text-[30px] font-[poppins-bold]">
                    ₹179
                    <Text className="text-[15px] font-[poppins-bold]">
                      {" "}
                      / Day
                    </Text>
                  </Text>
                )}

                {productDetails.isPurchasable && (
                  <View className="">
                    <TouchableOpacity
                      onPress={handleTooglePurchaseType}
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
                )}
              </View>
              {/* quantity section */}
              <View className="flex flex-col gap-y-2">
                <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                  <TouchableOpacity
                    onPress={() => {
                      setQuantity((prev) => (prev == 1 ? 1 : prev - 1));
                    }}
                    className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                    <AntDesign name="minus" size={29} color="black" />
                  </TouchableOpacity>
                  <Text className="font-[poppins-xbold] text-[18px] mr-4 ml-4">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setQuantity((prev) => (prev >= 50 ? 50 : prev + 1));
                    }}
                    className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                    <AntDesign name="plus" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                {!toogleSale && (
                  <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                    <TouchableOpacity
                      onPress={() => {
                        setRentDays((prev) => (prev == 1 ? 1 : prev - 1));
                      }}
                      className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                      <AntDesign name="minus" size={29} color="black" />
                    </TouchableOpacity>

                    <Text className="font-[poppins-xbold] text-[18px] mr-4 ml-4">
                      {rentDays}
                      {"  "}
                      <Text className="font-[poppins-bold] text-[15px]">
                        Day
                      </Text>
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setRentDays((prev) => (prev >= 50 ? 50 : prev + 1));
                      }}
                      className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                      <AntDesign name="plus" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                )}

                <View>
                  {availableStocks === 0 || quantity > availableStocks ? (
                    <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                      Out of stock
                    </Text>
                  ) : (
                    <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                      ({availableStocks} items) In stock
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* buy now or add to cart button */}
            <View className="pt-7 flex flex-row gap-y-3 gap-x-5 justify-center items-center">
              <TouchableHighlight className="bg-dark-purple h-[55px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                <Text className="text-white text-[16px] font-[poppins-bold]">
                  Add To Cart
                </Text>
              </TouchableHighlight>

              <TouchableHighlight className="bg-[#f07354] h-[55px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                <Text className="text-white text-[16px] font-[poppins-bold]">
                  {toogleSale ? "By Now" : "Rent It"}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          {/* product description */}
          <View className="pt-4 pb-6 pl-1 pr-1">
            <Text className="text-[18px] font-[poppins-bold]">
              Product Details
            </Text>
            <HTML
              systemFonts={["poppins", "poppins-mid", "poppins-bold"]}
              contentWidth={width}
              source={{
                html: productDetails.description || "<p>No description</p>",
              }}
            />
          </View>
          {/* rating and reviews */}
          <View className="pt-4 pb-6 flex flex-col gap-y-2 pl-1 pr-1">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-col gap-y-2">
                <Text className="text-[18px] font-[poppins-bold]">
                  Feedbacks
                </Text>
                <View>
                  <View className="flex flex-row items-center gap-x-1">
                    <AntDesign name={"star"} size={20} color={"black"} />
                    <Text className="text-[18px] align-middle">
                      {productDetails.stars}{" "}
                    </Text>
                    <Text className="text-[#787878] text-[15px] align-middle">
                      ({productDetails.totalFeedbacks})
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReviewSheetOpen}
                className="rounded-full w-[40px] h-[40px] flex flex-row self-start items-center justify-center bg-dark-purple shadow">
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* feedback cards */}
            <View className={"flex flex-col items-center"}>
              <View className="flex flex-col pt-5">
                <FeedbackCard
                  userIcon="https://harleydietitians.co.uk/wp-content/uploads/2018/11/no_profile_img.png"
                  feedbackGivenBy="Nishal Barman"
                  feedBackDate="24 June 2023"
                  starsGiven={2}
                  feedbackText="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos placeat libero laborum mollitia. Accusantium numquam minima voluptas, cupiditate, et praesentium, a quae illum alias quidem molestiae molestias eius nesciunt repellat?"
                />

                <FeedbackCard
                  userIcon="https://harleydietitians.co.uk/wp-content/uploads/2018/11/no_profile_img.png"
                  feedbackGivenBy="Tanmay Barman"
                  feedBackDate="25 June 2023"
                  starsGiven={4}
                  feedbackText="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos placeat libero laborum mollitia. Accusantium numquam minima voluptas, cupiditate, et praesentium, a quae illum alias quidem molestiae molestias eius nesciunt repellat?"
                />
              </View>
              <TouchableOpacity className="flex items-center justify-center w-[200px] h-[48px] p-[0px_20px] bg-white rounded-lg border">
                <Text className="text-black font-bold">Load More</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* related products */}
          <View className="pt-4 pb-6 flex flex-col gap-y-2 pl-1 pr-1">
            <Text className="text-[17px] font-[poppins-bold]">
              Related Products
            </Text>

            <View className="flex flex-col pt-5">
              <RelatedProductList />
            </View>
          </View>

          {/* action sheet for feedback for user */}
          <ActionSheet
            closeOnPressBack={true}
            gestureEnabled={true}
            ref={reviewSheetModalRef}>
            <NativeViewGestureHandler
              simultaneousHandlers={handlers.simultaneousHandlers}>
              <ScrollView {...handlers}>
                <View className="pt-8 flex flex-col items-center gap-y-5 pb-10">
                  <Text className="font-[poppins-bold] text-[21px]">
                    What is your rate?
                  </Text>
                  <View className="flex flex-row items-center justify-center gap-x-3">
                    {starsArray.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setCurrentUserReviewStar(index + 1);
                          }}>
                          <AntDesign
                            name={
                              index + 1 <= Math.round(currentUserReviewStar)
                                ? "star"
                                : "staro"
                            }
                            size={35}
                            color={
                              index + 1 <= Math.round(currentUserReviewStar)
                                ? "orange"
                                : "black"
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View className="pl-10 pr-10 pt-4">
                    <Text className="font-[poppins-mid] text-[18px] text-center">
                      Please share your opinion about the product
                    </Text>
                  </View>
                  <View className={"w-[90%] border rounded-lg"}>
                    <TextInput
                      multiline={true}
                      className={`h-[250px] shadow-lg text-black p-4 placeholder:text-[18px] text-[18px] font-[poppins-mid]`}
                      placeholder="Your review"
                      placeholderTextColor={"grey"}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleSubmitReview}
                    className="flex items-center justify-center w-[200px] h-[52px] p-[0px_20px] bg-[#d875ff] rounded-lg">
                    <Text className="text-white font-bold">Add Review</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </NativeViewGestureHandler>
          </ActionSheet>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
