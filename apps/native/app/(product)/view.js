import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

import { Foundation } from "@expo/vector-icons";

import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import axios from "axios";

import { useSelector } from "react-redux";
import SingleProductSkeleton from "../../Skeletons/SingleProductSkeleton";
import FeedbackCardSkeleton from "../../Skeletons/FeedbackCardSkeleton";
import ProductPageSkeleton from "../../Skeletons/ProductPageSkeleton";

import { useAddOneToCartMutation } from "@store/rtk/apis/cartApi";

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
  const [doesUserBoughtThisProduct, setDoesUserBoughtThisProduct] =
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
      handleError(error);
    }
  };

  //  FEEDBACK:  fetch data
  const getFeedbackForProduct = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/feedbacks/view/${productId}?page=${feedbackFetchPage}&limit=${feedbackFetchLimit}`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (res.data?.data?.feedbacks && res.data?.data.totalPages) {
        setFeedbacks([...feedbacks, ...res.data?.data?.feedbacks]);
        setFeedbackTotalPages(res.data?.data.totalPages || 0);
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
      if (!productDetails?.productVariant) {
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
      console.log("Variant In Cart --> ", response);
      setInCart(!!response?.data?.incart);
    } catch (error) {
      console.error(error);
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

      console.log("Variant In Stock --> ", response);

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

      console.log(
        "What is matched Variant with selected Size and Color -->",
        matchedVariant
      );

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

  const handleAddToCart = async () => {
    try {
      const cartObject = {
        productId,
        quantity,
        rentDays,
        productType: productType,
      };

      if (productDetails?.productVariant) {
        cartObject.variant = filteredVariant._id;
      }

      const response = await addToCart(cartObject).unwrap();
      // if (response.status) {
      setInCart(true);
      console.log(response);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductRentClick = () => {};
  const handleProductBuyClick = () => {};

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
      <ScrollView>
        {isProductFetching ? (
          <ProductPageSkeleton />
        ) : (
          <>
            {/* carousel view */}
            <View className="w-[100%] px-5 flex items-center rounded-md">
              <Carousel
                className="mb-3"
                pagingEnabled={true}
                width={width}
                height={width}
                autoPlay={false}
                data={
                  filteredVariant?.showPictures ||
                  productDetails?.showPictures ||
                  []
                }
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
                length={
                  filteredVariant?.showPictures?.length ||
                  productDetails?.showPictures?.length ||
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
              />
            </View>

            {/* product body */}
            <View className="flex flex-1 p-[12px] flex-col">
              <Text className="font-[poppins-mid] leading-[103%] text-grey text-[16px]">
                {productDetails.title}
              </Text>
              {/* rating and start */}
              <View className="flex flex-row gap-x-2 h-10 items-center mb-3 mt-1">
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
                  <View className="bg-white rounded-[10px] px-4 py-5 rounded-[10px] shadow-sm border border-gray-300 mb-2">
                    {/* // size section */}
                    <View className="flex flex-col pb-4">
                      <Text className="text-[17px] font-[poppins] mb-3">
                        Size:{" "}
                        <Text className="uppercase font-[poppins-bold] text-[16px]">
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
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedProductSize(item);
                              }}
                              style={{
                                backgroundColor:
                                  selectedProductSize === item
                                    ? "#9470B5"
                                    : "white",
                              }}
                              className="w-[50px] h-[45px] rounded-lg mx-2 flex items-center justify-center shadow-sm border  text-white">
                              <Text
                                style={{
                                  color:
                                    selectedProductSize === item
                                      ? "white"
                                      : "black",
                                }}
                                className="text-[15px] font-[poppins-bold]">
                                {item}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>

                    {/* // Colors section */}
                    <View className="flex flex-col pb-2 mt-2">
                      <Text className="text-[17px] font-[poppins] mb-3">
                        Color:{" "}
                        <Text className="uppercase font-[poppins-bold] text-[16px]">
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
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedProductColor(item);
                              }}
                              style={{
                                backgroundColor:
                                  selectedProductColor === item
                                    ? "#9470B5"
                                    : "white",
                              }}
                              className="flex items-center justify-center w-fit px-3 h-[45px] rounded-lg mx-2 shadow-sm border">
                              <Text
                                style={{
                                  color:
                                    selectedProductColor === item
                                      ? "white"
                                      : "black",
                                }}
                                className="text-md font-bold">
                                {item}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
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
                        {filteredVariant?.rentingPrice ||
                          productDetails.rentingPrice}
                        <Text className="text-[15px] font-[poppins-bold]">
                          {" "}
                          / Day
                        </Text>
                      </Text>
                    ) : (
                      <Text className="text-[30px] font-[poppins-bold]">
                        ₹
                        {filteredVariant?.discountedPrice ||
                          productDetails.discountedPrice}{" "}
                        <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                          ₹
                          {filteredVariant?.originalPrice ||
                            productDetails.originalPrice}
                        </Text>
                      </Text>
                    )}
                    <Text className="text-[15px] leading-2">
                      Shipping: ₹
                      {productDetails?.variant?.shippingPrice ||
                        productDetails?.shippingPrice}
                      {!freeDelivery && "\n\nFREE shipping above 500"}
                    </Text>
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
                      {!inStock ? (
                        <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                          Not in stock
                        </Text>
                      ) : (
                        <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                          {/* ({productDetails.availableStocks} items) */}
                          In stock
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* buy now or add to cart button */}
                <View className="pt-7 flex flex-row gap-y-3 gap-x-5 justify-center items-center">
                  <TouchableHighlight
                    onPress={handleAddToCart}
                    style={
                      !inStock || inCart
                        ? { backgroundColor: "black", opacity: 0.4 }
                        : {}
                    }
                    disabled={!inStock || inCart}
                    className="bg-dark-purple h-[50px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                    {isAddToCartLoading ? (
                      <ActivityIndicator size={20} color={"white"} />
                    ) : inCart ? (
                      <AntDesign name="check" size={24} color="white" />
                    ) : (
                      <Text className="text-white text-[16px] font-[poppins-bold]">
                        Add To Cart
                      </Text>
                    )}
                  </TouchableHighlight>

                  {/* {productType === "rent" ? (
                    <TouchableHighlight
                      onPress={handleProductRentClick}
                      style={
                        !inStock
                          ? { backgroundColor: "black", opacity: 0.4 }
                          : {}
                      }
                      disabled={!inStock}
                      className="bg-[#f07354] h-[50px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                      <Text className="text-white text-[16px] font-[poppins-bold]">
                        Rent It
                      </Text>
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight
                      onPress={handleProductBuyClick}
                      style={
                        !inStock
                          ? { backgroundColor: "black", opacity: 0.4 }
                          : {}
                      }
                      disabled={!inStock}
                      className="bg-[#f07354] h-[50px] flex-1 text-[16px] text-white flex flex-row justify-center items-center rounded-md">
                      <Text className="text-white text-[16px] font-[poppins-bold]">
                        By Now
                      </Text>
                    </TouchableHighlight>
                  )} */}
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
