import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";
import HTML from "react-native-render-html";

import { AntDesign } from "@expo/vector-icons";

import { SheetManager } from "react-native-actions-sheet";

import FeedbackCard from "../../components/FeedbackCard/FeedbackCard";
import RelatedProductList from "../../components/RelatedProductSection/RelatedProductList";
import SearchBar from "../../components/SearchBar/SearchBar";

import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import axios from "axios";

import { useSelector } from "react-redux";
import SingleProductSkeleton from "../../Skeletons/SingleProductSkeleton";
import FeedbackCardSkeleton from "../../Skeletons/FeedbackCardSkeleton";
import ProductPageSkeleton from "../../Skeletons/ProductPageSkeleton";

function product() {
  const { width } = useMemo(() => {
    return Dimensions.get("window");
  }, []);

  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const { id: productId } = useLocalSearchParams();

  const router = useRouter();

  const [isProductFetching, setIsProductFetching] = useState(true);
  const [isProductFetchError, setIsProductFetchError] = useState(false);
  const [error, setError] = useState(null);

  const [productDetails, setProductDetails] = useState({});
  const [doesUserBoughtThisProduct, setDoesUserBoughtThisProduct] =
    useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const [feedbackFetchPage, setFeedbackFetchPage] = useState(1);
  const [feedbackFetchLimit, setFeedbackFetchLimit] = useState(2);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(0);

  // fetch the product details from aserver
  const getProductDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/products/view/${productId}`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const { data } = res;
      setProductDetails(data?.product || {});
      setDoesUserBoughtThisProduct(data?.doesUserBoughtThisProduct || false);
    } catch (error) {
      console.error(error);
      setError(error);
      setIsProductFetchError(true);
      if (error.res.status === 401) {
        router.dismissAll();
        router.replace(`/auth/login?redirectTo=/product?id=${productId}`);
      } else if (error.res.status === 400) {
        router.dismiss(1);
      } else if (error.res.status === 403) {
        console.error(
          "Single Product Page Error-->",
          error?.res?.data?.message
        );
      }
    }
  };

  // fetch the feedback details from server
  const getFeedbackForProduct = async (page) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks/view/${productId}?page=${page}&limit=${feedbackFetchLimit}`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const { data } = res;
      if (data?.feedbacks) {
        setFeedbacks([...feedbacks, ...data?.feedbacks]);
        setFeedbackTotalPages(data?.totalPages || 0);
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setIsProductFetchError(true);
      if (error.res.status === 401) {
        router.dismissAll();
        router.replace(`/auth/login?redirectTo=/product?id=${productId}`);
      } else if (error.res.status === 400) {
        router.dismiss(1);
      } else if (error.res.status === 403) {
        console.error(
          "Single Product Page Error-->",
          error?.res?.data?.message
        );
      }
    }
  };

  const handleFeedbackLoadMore = () => {
    setFeedbackFetchPage((prev) => {
      getFeedbackForProduct(prev + 1);
      return prev + 1;
    });
  };

  useEffect(() => {
    (async () => {
      await Promise.all([
        getProductDetails(),
        getFeedbackForProduct(feedbackFetchPage),
      ]);
    })().then(() => {
      setIsProductFetching(false);
    });
  }, []);

  console.log("Product Varient -->", productDetails?.productVariant);

  const [selectedProductSize, setSelectedProductSize] = useState("S");
  const [selectedProductColor, setSelectedProductColor] = useState("red");
  const [rentDays, setRentDays] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const handleReviewSheetOpen = useCallback(() => {
    SheetManager.show("add-feedback-sheet", {
      payload: { productId },
    });
  }, []);

  const [toogleSale, setToogleSale] = useState(productDetails.isPurchasable);

  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);

  const handleTooglePurchaseType = () => {
    if (productDetails.isPurchasable) {
      setToogleSale((prev) => !prev);
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          title: productDetails.title || "",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />
      <ScrollView>
        {isProductFetching ? (
          <ProductPageSkeleton />
        ) : (
          <>
            {/* carousel view */}
            <View className="w-[100%] px-5 flex items-center">
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
                length={productDetails?.showPictures?.length || 0}
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
                    config: {
                      color: "#b778e3",
                      margin: 3,
                      opacity: 0.5,
                      size: 6,
                    },
                    quantity: 1,
                  },
                  {
                    config: {
                      color: "#b778e3",
                      margin: 3,
                      opacity: 0.5,
                      size: 4,
                    },
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

              {!!productDetails?.isVariantAvailable &&
                !!productDetails?.productVariant && (
                  <View className="bg-white rounded-[10px] p-4 pt-5 pb-5 rounded-[10px] shadow-sm bg-[#eadff2]">
                    {/* // size section */}
                    <View className="flex flex-col pb-4 gap-y-2">
                      <Text className="text-[17px] font-[poppins]">
                        Size:{" "}
                        <Text className="uppercase font-[poppins-bold] text-[16px]">
                          {selectedProductSize?.title || "Not selected"}
                        </Text>
                      </Text>
                      <FlatList
                        horizontal
                        data={productDetails?.productVariant || []}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                          console.log("What does item have -->", item);
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedProductSize(item.size);
                              }}
                              style={{
                                backgroundColor:
                                  selectedProductSize.title ===
                                  item?.size?.title
                                    ? "#9470B5"
                                    : "white",
                              }}
                              className="w-[40px] h-[40px] rounded-lg m-2 flex items-center justify-center shadow-sm text-white">
                              <Text
                                style={{
                                  color:
                                    selectedProductSize.title ===
                                    item?.size?.title
                                      ? "white"
                                      : "black",
                                }}
                                className="text-[15px] font-[poppins-bold]">
                                {item?.size?.title}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>

                    {/* // Colors section */}
                    <View className="flex flex-col pb-2 gap-y-2">
                      <Text className="text-[17px] font-[poppins]">
                        Color:{" "}
                        <Text className="uppercase font-[poppins-bold] text-[16px]">
                          {selectedProductColor?.title || "Not Selected"}
                        </Text>
                      </Text>

                      <FlatList
                        horizontal
                        data={productDetails?.productVariant || []}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedProductColor(item?.color);
                            }}
                            style={{
                              backgroundColor: item?.color?.title,
                              // opacity: item === selectedProductColor ? 0.2 : 1,
                            }}
                            className={`w-[39px] h-[39px] rounded-lg m-2 flex items-center justify-center shadow-sm text-white ${selectedProductColor === item?.color?.title && "rounded-full"}`}>
                            {/* <AntDesign name="pushpino" size={24} color={"black"} /> */}
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </View>
                )}

              {/* price and quantity section */}
              <View>
                <View className="flex flex-row justify-between items-center gap-y-1 p-[0px_10px]">
                  {/* price */}
                  <View className="flex gap-y-2">
                    {productType === "rent" ? (
                      <Text className="text-[30px] font-[poppins-bold]">
                        {productDetails.rentingPrice}
                        <Text className="text-[15px] font-[poppins-bold]">
                          {" "}
                          / Day
                        </Text>
                      </Text>
                    ) : (
                      <Text className="text-[30px] font-[poppins-bold]">
                        ₹{productDetails.discountedPrice}{" "}
                        <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                          ₹{productDetails.originalPrice}
                        </Text>
                      </Text>
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

                    {productType == "rent" && (
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
                      {productDetails.availableStocks === 0 ||
                      quantity > productDetails.availableStocks ? (
                        <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                          Out of stock
                        </Text>
                      ) : (
                        <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                          ({productDetails.availableStocks} items) In stock
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

                  {productType === "rent" ? (
                    <TouchableHighlight className="bg-[#f07354] h-[55px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                      <Text className="text-white text-[16px] font-[poppins-bold]">
                        Rent It
                      </Text>
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight className="bg-[#f07354] h-[55px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                      <Text className="text-white text-[16px] font-[poppins-bold]">
                        By Now
                      </Text>
                    </TouchableHighlight>
                  )}
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

                  {doesUserBoughtThisProduct && (
                    <TouchableOpacity
                      onPress={handleReviewSheetOpen}
                      className="rounded-full w-[40px] h-[40px] flex flex-row self-start items-center justify-center bg-dark-purple shadow">
                      <AntDesign name="plus" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* feedback cards */}
                <View className={"flex flex-col items-center w-full"}>
                  <View className="flex flex-col pt-5 w-full">
                    {isProductFetching ? (
                      <>
                        <FeedbackCardSkeleton />
                        <FeedbackCardSkeleton />
                      </>
                    ) : feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => (
                        <FeedbackCard
                          userIcon="https://harleydietitians.co.uk/wp-content/uploads/2018/11/no_profile_img.png"
                          feedbackGivenBy={feedback.givenBy}
                          feedBackDate={feedback.createdAt}
                          starsGiven={feedback.starsGiven}
                          feedbackText={feedback.description}
                        />
                      ))
                    ) : (
                      <Text className="text-lg">No reviews</Text>
                    )}
                    {/* <FeedbackCard
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
                /> */}
                  </View>
                  {feedbackTotalPages === 0 ||
                    feedbackTotalPages <= feedbackFetchPage || (
                      <TouchableOpacity
                        onPress={handleFeedbackLoadMore}
                        disabled={
                          feedbackTotalPages === 0 ||
                          feedbackTotalPages <= feedbackFetchPage
                        }
                        className="flex items-center justify-center w-[200px] h-[48px] p-[0px_20px] bg-white rounded-lg bg-dark-purple">
                        <Text className="text-white text-lg font-bold">
                          Load More
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
              {/* related products */}
              {/* <View className="pt-4 pb-6 flex flex-col gap-y-2 pl-1 pr-1">
            <Text className="text-[17px] font-[poppins-bold]">
              Related Products
            </Text>

            <View className="flex flex-col pt-5">
              <RelatedProductList />
            </View>
          </View> */}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default product;
