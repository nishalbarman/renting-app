import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { Image } from "expo-image";
import RenderHTML from "react-native-render-html";

import { AntDesign, Ionicons } from "@expo/vector-icons";

import { SheetManager } from "react-native-actions-sheet";

import FeedbackCard from "../../components/FeedbackCard/FeedbackCard";
import RelatedProductList from "../../components/RelatedProductSection/RelatedProductList";
import SearchBar from "../../components/SearchBar/SearchBar";

import { Foundation } from "@expo/vector-icons";

import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import axios from "axios";

import { useSelector } from "react-redux";
import SingleProductSkeleton from "../../Skeletons/SingleProductSkeleton";
import FeedbackCardSkeleton from "../../Skeletons/FeedbackCardSkeleton";
import ProductPageSkeleton from "../../Skeletons/ProductPageSkeleton";

import ImageSldr from "../../components/ImageSldr";

import { useAddOneToCartMutation } from "@store/rtk";
import Toast from "react-native-toast-message";
import handleGlobalError from "../../lib/handleError";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

function product() {
  const { width } = useMemo(() => {
    return Dimensions.get("window");
  }, []);

  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const { id: productId } = useLocalSearchParams();

  console.log("Product ID : ", productId);

  const router = useRouter();

  // inital product details needs to be loaded from server
  const [isProductFetching, setIsProductFetching] = useState(true);
  const [isProductFetchError, setIsProductFetchError] = useState(false);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  // product availability related state
  const [inStock, setInStock] = useState(false);
  const [inCart, setInCart] = useState(false);

  // FEEDBACK: section realted states
  const [hasUserBoughtThisProduct, setHasUserBoughtThisProduct] =
    useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  // FEEDBACK: pagination state
  const [feedbackFetchPage, setFeedbackFetchPage] = useState(1);
  const [feedbackFetchLimit, setFeedbackFetchLimit] = useState(2);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(0);

  // available sizes and colors, will be filled from useEffect()
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);

  // selected product size and color by user
  const [selectedProductSize, setSelectedProductSize] = useState("");
  const [selectedProductColor, setSelectedProductColor] = useState("");

  // rent days and quantity
  const [rentDays, setRentDays] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // filteredVariant is the variant which is getting filtered when user is selecting size and color, if no variant is available then it will be a falsy value.
  const [filteredVariant, setFilteredVariant] = useState(undefined); // filteredVariant will only be used to show the price for the item

  // button disables state
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // carousel index
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0);

  const starsArray = useMemo(() => {
    return Array.from({ length: 5 });
  }, []);

  const handleError = (err) => {
    console.error(err);
    setError(err);
    setIsProductFetchError(true);
    if (err.res.status === 401) {
      router.dismissAll();
      router.replace(`/auth/login?redirectTo=/product?id=${productId}`);
    } else if (err.res.status === 400) {
      router.dismiss(1);
    } else if (err.res.status === 403) {
      console.error("Single Product Page Error-->", err?.res?.data?.message);
    }
  };

  // PRODUCTS: fetch
  const getProductDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/products/view/${productId}`,
        {
          productType: productType,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setProductDetails(res.data?.product || {});
      // console.log(
      //   "Is order placed already -->",
      //   res.data?.hasUserBoughtThisProduct
      // );
      setHasUserBoughtThisProduct(res.data?.hasUserBoughtThisProduct);
    } catch (error) {
      handleError(error);
    }
  };

  //  FEEDBACK:  fetch data
  const getFeedbackForProduct = async () => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks/list/${productId}?page=${feedbackFetchPage}&limit=${feedbackFetchLimit}`,
        {
          productType: productType,
        },
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (res.data?.feedbacks && res.data?.totalPages) {
        setFeedbacks([...feedbacks, ...res.data?.feedbacks]);
        setFeedbackTotalPages(res.data?.totalPages || 0);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleFeedbackLoadMore = () => {
    setFeedbackFetchPage((prev) => {
      getFeedbackForProduct(prev + 1);
      return prev + 1;
    });
  };

  // get product list and feedback list
  useEffect(() => {
    (async () => {
      await Promise.all([getProductDetails(), getFeedbackForProduct()]);
    })().then(() => {
      setIsProductFetching(false);
    });
  }, []);

  useEffect(() => {
    const extractProductVariantSizeAndColorList = () => {
      // product details not loaded yet so return
      if (!productDetails) return;

      // product details doesnot contain any variant
      // console.log("Product variant -->", productDetails?.productVariant);
      if (
        !productDetails?.productVariant ||
        productDetails.productVariant <= 0
      ) {
        setButtonDisabled(false);
        checkVariantInCart([{}]); // we have no variant so adding blank object, so that when function tries to access matchedVariant._id its gets undefined. (to eliminate the variant)
        setInStock(productDetails?.availableStocks > 0);
        return;
      }

      const filterOutDuplicateKey = {}; // making this object to filter out the duplicate values for size and color

      const sizes = []; // size list
      const colors = []; // color list

      // extract and filter out available values for size and color from variant object
      productDetails.productVariant.forEach((variant) => {
        if (!filterOutDuplicateKey.hasOwnProperty(variant.size)) {
          sizes.push(variant.size);
          filterOutDuplicateKey[variant.size] = true;
        }
        if (!filterOutDuplicateKey.hasOwnProperty(variant.color)) {
          colors.push(variant.color);
          filterOutDuplicateKey[variant.color] = true;
        }
      });

      // add extracted size and color to state variable
      setAvailableSizes(sizes);
      setAvailableColors(colors);

      // set base product color and size
      setSelectedProductColor(productDetails.productVariant[0].color);
      setSelectedProductSize(productDetails.productVariant[0].size);
    };

    extractProductVariantSizeAndColorList();
  }, [productDetails]);

  // this function will be called only if there are variants (NO VARIANTS = NO CALL)
  const checkVariantInCart = async (matchedVariant) => {
    if (!matchedVariant) return;

    // chcek in cart or not
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/cart/incart/${productId}`,
        {
          productType: productType,
          variant: matchedVariant[0]?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Variant In Cart --> ", response);
      setInCart(!!response?.data?.incart);
    } catch (error) {
      console.error(error);
      handleGlobalError(error);
    }
  };

  // this function will be only called if there are variants (NO VARIANTS = NO CALL)
  const checkVariantInStock = async (matchedVariant) => {
    if (!matchedVariant) return;
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/products/variant/instock/${productId}`,
        {
          productType: productType,
          variant: matchedVariant[0]?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Variant In Stock --> ", response);

      setInStock(!!response?.data?.inStock);
    } catch (error) {
      console.error(error);
    }
  };

  // when user selects different color and size
  useEffect(() => {
    // set filtered variant variable by filtering productVariatns with selected SIZE and COLOR
    const filterVariantWithSizeAndColor = () => {
      if (
        !productDetails ||
        !productDetails?.productVariant ||
        !productDetails?.productVariant?.length > 0
      ) {
        return;
      }

      // filter out variant with selected size and color
      const matchedVariant = productDetails.productVariant.filter(
        (item) =>
          item.size === selectedProductSize &&
          item.color === selectedProductColor
      );

      // then verify the variant with these functions
      checkVariantInCart(matchedVariant);
      checkVariantInStock(matchedVariant);

      // console.log(
      //   "What is matched Variant with selected Size and Color -->",
      //   matchedVariant
      // );

      // matchedVariant will be an array - if match found length will be greater than 0 otherwise it will be 0
      if (matchedVariant.length !== 0) {
        // matched variant can be empty array or it may have 1 item.
        // if variant match found with selected size and color than it will contain one element (VARIANTS COLLECTION SHOULD NOT HAVE DUPLICATE VARIANTS FOR ONE PRODUCT OTHERWISE IT WILL CONTAIN MORE THAN ONE ELEMENT)
        setFilteredVariant(matchedVariant[0]);
      }
    };

    filterVariantWithSizeAndColor();
  }, [selectedProductSize, selectedProductColor]);

  // NO VARIENT: if there is no varient for product then check stock and inCart
  useEffect(() => {}, [productDetails]);

  const handleReviewSheetOpen = useCallback(() => {
    SheetManager.show("add-feedback-sheet", {
      payload: { productId },
    });
  }, []);

  const [addToCart, { isLoading: isAddToCartLoading }] =
    useAddOneToCartMutation();

  const handleGoToCart = () => {
    router.navigate({
      pathname: "cart",
    });
  };

  const handleAddToCart = async () => {
    try {
      const cartObject = {
        productId,
        quantity,
        rentDays,
        productType: productType,
      };

      if (
        productDetails?.productVariant &&
        productDetails.productVariant.length > 0
      ) {
        cartObject.variant = filteredVariant._id;
      }

      const response = await addToCart(cartObject).unwrap();
      // if (response.status) {
      setInCart(true);
      Toast.show({
        type: "sc",
        text1: "Added to cart",
      });
      // console.log(response);
      // }
    } catch (error) {
      Toast.show({
        type: "err",
        text1: "Added to cart failed",
      });
      console.error(error);
    }
  };

  const handleBuyNow = () => {
    try {
      router.navigate({
        pathname: "select-address",
        params: {
          checkoutSingleOrCart: "SINGLE",
          productId: productId,
          filteredVariantId: filteredVariant?._id,
          quantity: quantity,
        },
      });
    } catch (error) {
      handleGlobalError(error);
    }
  };

  const freeDelivery = false;

  return (
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />
      <ScrollView stickyHeaderIndices={[[4]]}>
        {isProductFetching ? (
          <ProductPageSkeleton />
        ) : (
          <>
            {/* carousel view */}
            <View className="w-[100%] px-5 flex items-center rounded-md">
              <ImageSldr
                images={
                  filteredVariant?.slideImages ||
                  productDetails?.slideImages ||
                  []
                }
              />
              {/* <Carousel
                className="mb-3"
                pagingEnabled={true}
                width={width}
                height={width}
                autoPlay={false}
                data={
                  filteredVariant?.slideImages ||
                  productDetails?.slideImages ||
                  []
                }
                scrollAnimationDuration={1000}
                // onSnapToItem={(index) => console.log("current index:", index)}
                onProgressChange={(_, progress) => {
                  setCarouselCurrentIndex(Math.ceil(progress));
                }}
                renderItem={({ index }) => {
                  return (
                    <Image
                      className="bg-white w-[100%] h-[100%]"
                      source={{ uri: productDetails.slideImages[index] }}
                      contentFit="contain"
                      contentPosition={"center"}
                    />
                  );
                }}
              />
              <AnimatedDotsCarousel
                length={
                  filteredVariant?.slideImages?.length ||
                  productDetails?.slideImages?.length ||
                  0
                }
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
              /> */}
            </View>

            {/* product body */}
            <View className="flex flex-1 p-[12px] flex-col">
              <Text
                numberOfLines={3}
                className="font-[roboto-mid] leading-[103%] text-black text-[16px]">
                {productDetails.title}
              </Text>

              {/* rating and start */}
              <View className="flex-row gap-x-2 h-10 items-center">
                <View className="flex flex-row items-center justify-center">
                  {starsArray.map((item, index) => {
                    return (
                      <AntDesign
                        key={index}
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
                <Text className="text-[#787878] text-sm">
                  ({productDetails.totalFeedbacks})
                </Text>
              </View>

              {/* size and color section */}
              {!!productDetails?.isVariantAvailable &&
                !!productDetails?.productVariant && (
                  <View className="bg-white rounded-[10px] px-3 py-3 rounded-[10px] shadow-sm border border-gray-300 mb-2 mt-2">
                    {/* // size section */}
                    <View className="flex flex-col pb-4">
                      <Text className="text-[17px] font-[roboto] mb-3">
                        Size:{" "}
                        <Text className="uppercase font-[roboto-bold] text-[16px]">
                          {!!selectedProductSize
                            ? selectedProductSize
                            : "Not selected"}
                        </Text>
                      </Text>
                      <FlatList
                        horizontal
                        data={availableSizes}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                          return (
                            <Pressable
                              onPress={() => {
                                setSelectedProductSize(item);
                              }}
                              className={`h-9 w-14 rounded-lg mx-2 flex items-center justify-center shadow-sm text-white ${selectedProductSize !== item ? "bg-white border border-gray-300" : "bg-black"}`}>
                              <Text
                                style={{
                                  color:
                                    selectedProductSize === item
                                      ? "white"
                                      : "black",
                                }}
                                className="text-[15px] font-[roboto-bold]">
                                {item}
                              </Text>
                            </Pressable>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>

                    {/* // Colors section */}
                    <View className="flex flex-col pb-2 mt-2">
                      <Text className="text-[17px] font-[roboto] mb-3">
                        Color:{" "}
                        <Text className="uppercase font-[roboto-bold] text-[16px]">
                          {!!selectedProductColor
                            ? selectedProductColor
                            : "Not Selected"}
                        </Text>
                      </Text>
                      <FlatList
                        horizontal
                        data={availableColors}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                          return (
                            <Pressable
                              onPress={() => {
                                setSelectedProductColor(item);
                              }}
                              className={`flex items-center justify-center h-10 w-fit px-5 rounded-lg mx-2 shadow-sm border ${selectedProductColor !== item ? "bg-white border border-gray-300" : "bg-black"}`}>
                              <Text
                                style={{
                                  color:
                                    selectedProductColor === item
                                      ? "white"
                                      : "black",
                                }}
                                className="text-[15px] font-[roboto-bold]">
                                {item}
                              </Text>
                            </Pressable>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </View>
                )}

              {/* //price and quantity section */}
              <View className="rounded-md mt-1 bg-[#e3eeff]">
                <View className="flex flex-row flex-wrap justify-between items-center px-3 py-3">
                  <View className="flex gap-y-2">
                    {productType === "rent" ? (
                      <View className="flex-row items-center">
                        <Text className="text-[30px] font-[roboto-bold]">
                          {filteredVariant?.rentingPrice ||
                            productDetails.rentingPrice}
                        </Text>
                        <Text className="text-[15px] font-[roboto-bold]">
                          {" "}
                          / Day
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-[30px] font-[roboto-bold]">
                        ₹
                        {filteredVariant?.discountedPrice ||
                          productDetails.discountedPrice}{" "}
                        <Text className="text-[15px] text-[#787878] font-[roboto] line-through">
                          ₹
                          {filteredVariant?.originalPrice ||
                            productDetails.originalPrice}
                        </Text>
                      </Text>
                    )}
                    <View className="mb-2">
                      <Text className="text-[15px] font-[roboto]">
                        Shipping: ₹
                        {productDetails?.variant?.shippingPrice ||
                          productDetails?.shippingPrice}{" "}
                      </Text>
                      {!freeDelivery && (
                        <Text className="text-[15px] font-[roboto]">
                          FREE shipping above 500
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* quantity section */}
                  <View className="flex flex-col gap-y-2">
                    <View className="flex flex-row justify-center items-center rounded-[30px] self-start py-1 px-1 bg-white">
                      <TouchableOpacity
                        onPress={() => {
                          setQuantity((prev) => (prev == 1 ? 1 : prev - 1));
                        }}
                        className="rounded-full w-6 h-6 flex flex items-center justify-center bg-black">
                        <AntDesign name="minus" size={19} color="white" />
                      </TouchableOpacity>
                      <Text className="font-[roboto-xbold] text-[18px] mr-4 ml-4">
                        {quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setQuantity((prev) => (prev >= 50 ? 50 : prev + 1));
                        }}
                        className="rounded-full w-6 h-6 flex flex items-center justify-center bg-black">
                        <AntDesign name="plus" size={16} color="white" />
                      </TouchableOpacity>
                    </View>

                    {productType == "rent" && (
                      <>
                        <View className="h-1 rounded-md border-t border-gray-500 my-3"></View>
                        <View className="flex flex-row justify-center items-center rounded-[30px] self-start bg-white py-1 px-1">
                          <TouchableOpacity
                            onPress={() => {
                              setRentDays((prev) => (prev == 1 ? 1 : prev - 1));
                            }}
                            className="rounded-full w-6 h-6 flex flex items-center justify-center bg-white bg-black">
                            <AntDesign name="minus" size={19} color="white" />
                          </TouchableOpacity>
                          <Text className="font-[roboto-xbold] text-[18px] mr-4 ml-4">
                            {rentDays}
                            {"  "}
                            <Text className="font-[roboto-bold] text-[15px]">
                              Day
                            </Text>
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setRentDays((prev) =>
                                prev >= 50 ? 50 : prev + 1
                              );
                            }}
                            className="rounded-full w-6 h-6 flex flex items-center justify-center bg-white bg-black">
                            <AntDesign name="plus" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    <View className="mt-5">
                      {!inStock ? (
                        <Text className="text-[13px] text-[#d12626] font-[roboto-bold]">
                          Not in stock
                        </Text>
                      ) : (
                        <Text className="text-[13px] text-[#32a852] font-[roboto-bold]">
                          {/* ({productDetails.availableStocks} items) */}
                          In stock
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* buy now or add to cart button */}
                <View className="bg-transparent w-full h-fit flex-row px-2 py-2">
                  <Pressable
                    onPress={handleBuyNow}
                    className="bg-black border border-gray-300 h-12 w-[48%] justify-center items-center rounded-md">
                    {/* <Ionicons
                      name="bag-handle-outline"
                      size={24}
                      color="white"
                    /> */}
                    <Text className="text-white font-[roboto-bold] text-sm">
                      Buy Now
                    </Text>
                  </Pressable>

                  {!inCart ? (
                    <>
                      <Pressable
                        onPress={handleAddToCart}
                        className="ml-2 bg-black h-12 w-[48%] justify-center items-center rounded-md flex-grow">
                        {isAddToCartLoading ? (
                          <ActivityIndicator size={20} color={"white"} />
                        ) : (
                          <Text className="text-white text-sm font-[roboto-bold]">
                            Add To Cart
                          </Text>
                        )}
                      </Pressable>
                    </>
                  ) : (
                    <Pressable
                      onPress={handleGoToCart}
                      className="ml-2 bg-black h-12 w-[48%] justify-center items-center rounded-md flex-grow">
                      <Text className="text-white text-sm font-[roboto-bold]">
                        Go To Cart
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>

              {/* //! product description */}
              <View className="my-7">
                <Text className="text-xl tracking-wider font-[roboto-bold] mb-2">
                  💁‍♂️ Product Details
                </Text>
                <View className="mt-2 pt-4 pb-6 bg-[#f2f2f2] rounded-md p-3">
                  <RenderHTML
                    systemFonts={["roboto", "roboto-mid", "roboto-bold"]}
                    contentWidth={width}
                    source={{
                      html:
                        `<html style="font-size: 13px">${productDetails.description}</html>` ||
                        "<p>No description</p>",
                    }}
                  />
                </View>
              </View>

              {/* //! rating and reviews */}
              <View className="my-3 pb-6 flex flex-col gap-y-2 rounded-md px-2 py-2">
                <View className="relative flex flex-row justify-between items-center w-full">
                  <View className="flex flex-row items-center gap-y-2 w-full">
                    <View className="h-10 rounded-md mb-1 lex justify-center">
                      <Text className="text-xl tracking-wider font-[roboto-bold]">
                        💬 Feedbacks
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-x-1 ml-2">
                      <AntDesign name={"star"} size={20} color={"black"} />
                      <Text className="text-[18px] align-middle">
                        {productDetails.stars}{" "}
                      </Text>
                      <Text className="text-[#787878] text-[15px] align-middle">
                        ({productDetails.totalFeedbacks})
                      </Text>
                    </View>
                  </View>

                  {hasUserBoughtThisProduct && (
                    <TouchableOpacity
                      onPress={handleReviewSheetOpen}
                      className="rounded-full w-[40px] h-[40px] flex flex-row self-start items-center justify-center bg-black shadow absolute right-0">
                      <AntDesign name="plus" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* feedback cards */}
                <View className={"flex flex-col items-center w-full px-1"}>
                  <View className="flex flex-col items-center py-5 w-full">
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
              <View className="pt-4 pb-6 flex flex-col gap-y-2 pl-1 pr-1">
                <Text className="text-lg tracking-wider font-[roboto-bold]">
                  Related Products
                </Text>

                <View className="flex flex-col pt-5">
                  <RelatedProductList query={productDetails.title} />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default product;
