import React, { useTransition, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGetCartQuery } from "@store/rtk";
import { useSelector } from "react-redux";
import CartCard from "../../components/CartItem/CartCard";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";

import axios from "axios";
import { useRouter } from "expo-router";
import PlaceOrderModal from "../../modal/Cart/PlaceRentOrderModal";

import EmptyBag from "../../components/EmptyBag/EmptyBag";

const CartPage = () => {
  const router = useRouter();

  const [isGlobalButtonDisabled, setIsGlobalButtonDisabled] = useState(false);

  const { jwtToken } = useSelector((state) => state.auth);
  const { productType } = useSelector((state) => state.product_store);

  const [amountDetails, setAmountDetails] = useState();

  const {
    data: cartItems,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    error: cartFetchError,
    refetch,
  } = useGetCartQuery(productType);

  useEffect(() => {
    refetch();
  }, [productType]);

  useEffect(() => {
    (() => {
      if (isCartLoading || isCartFetching) {
        return;
      }

      let shippingPrice = 0;

      const paymentObject = cartItems?.reduce(
        (pay, cartItem) => {
          let totalOriginalPrice = 0; // price for one cart item
          let discountedTotalPrice = 0; // price for one cart item

          console.log("Cart Item -->", cartItem);

          // if type is buy and product have variants (diffent color different size etc etc)
          if (productType === "buy" && !!cartItem?.variant) {
            const OriginalPrice = cartItem.variant.originalPrice;
            const Price = cartItem.variant.discountedPrice;
            const Quantity = cartItem.quantity;
            totalOriginalPrice = OriginalPrice * Quantity;
            discountedTotalPrice = Price * Quantity;

            shippingPrice += cartItem.variant.shippingPrice;
          }
          // else if type is buy and product does not have variants (diffent color different size etc etc)
          else if (productType === "buy" && !cartItem?.variant) {
            const OriginalPrice = cartItem.product.originalPrice;
            const Price = cartItem.product.discountedPrice;
            const Quantity = cartItem.quantity;
            totalOriginalPrice = OriginalPrice * Quantity;
            discountedTotalPrice = Price * Quantity;

            shippingPrice += cartItem.product.shippingPrice;
          }
          // else if type is rent and product does not have variants (diffent color different size etc etc)
          else if (productType === "rent" && !!cartItem?.variant) {
            const Price = cartItem.variant.rentingPrice;
            const Quantity = cartItem.quantity;
            const RentDays = cartItem.rentDays;
            discountedTotalPrice = Price * Quantity * RentDays;

            shippingPrice += cartItem.variant.shippingPrice;
          }
          // else if type is rent and product does not have variants (diffent color different size etc etc)
          else if (productType === "rent" && !cartItem?.variant) {
            const Price = cartItem.product.rentingPrice;
            const Quantity = cartItem.quantity;
            const RentDays = cartItem.rentDays;
            discountedTotalPrice = Price * Quantity * RentDays;
            shippingPrice += cartItem.product.shippingPrice;
          }

          return {
            originalTotalAmount: pay?.originalTotalAmount + totalOriginalPrice,
            discountedTotalAmount:
              pay?.discountedTotalAmount + discountedTotalPrice,
          };
        },
        { originalTotalAmount: 0, discountedTotalAmount: 0 }
      );

      console.log("Cart Payment Object -> ", paymentObject);

      const discountedTotalAmount = paymentObject?.discountedTotalAmount;

      const freeDeliveryAboveMinimumPurchase = false; // TODO: Need to get it from server.
      const freeDeliveryMinimumAmount = 500;

      if (
        !(
          freeDeliveryAboveMinimumPurchase &&
          paymentObject?.discountedTotalAmount >= freeDeliveryMinimumAmount
        )
      ) {
        paymentObject.discountedTotalAmount += shippingPrice;
      }

      setAmountDetails({
        finalAmount: paymentObject?.discountedTotalAmount,
        discountedAmount: discountedTotalAmount,
        shippingAmount: shippingPrice,
        originalAmount: paymentObject?.originalPrice,
      });
    })();
  }, [cartItems]);

  const handleChangeCenter = async () => {
    router.push("/select-address");
  };

  const [isCenterSelected, setIsCenterSelected] = useState(false);

  const selectedCenterAddress = useSelector(
    (state) => state.selectedCenterDetails
  );

  useEffect(() => {
    setIsCenterSelected(
      !!selectedCenterAddress?.centerName &&
        !!selectedCenterAddress?.address?.name &&
        !!selectedCenterAddress?.address?.streetName &&
        !!selectedCenterAddress?.address?.locality &&
        !!selectedCenterAddress?.address?.postalCode &&
        !!selectedCenterAddress?.address?.country
    );
  }, [selectedCenterAddress]);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [orderPlaceStatus, setOrderPlaceStatus] = useState("pending");
  const [orderPlaceModalVisible, setOrderPlaceModalVisible] = useState(false);

  const handleContinueClick = async () => {
    // product type is buy then goto select delivery address screen
    if (productType === "buy") return router.push("/select-address");

    // TODO: Place Order FOR the center
    setIsPlacingOrder(true);
    setIsGlobalButtonDisabled(true);

    // proccessing modal related
    setOrderPlaceStatus("pending");
    setOrderPlaceModalVisible(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/renting/rent?centerId=${selectedCenterAddress._id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("What the response-->", response);

      if (response.status == 200) {
        // router.replace("/(tabs)/my_orders");
        setOrderPlaceStatus("success");
        refetch();
      }
    } catch (error) {
      console.error(error);
      setOrderPlaceStatus("failed");
    } finally {
      setIsGlobalButtonDisabled(false);
      setIsPlacingOrder(false);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const { ordreRefetch } = useSelector((state) => state.order);

  useEffect(() => {
    console.log("Hook is getting called~");
    let timer;
    (() => {
      console.log("cart status", isCartLoading, isCartFetching);
      if (isCartLoading) return;
      if (!cartItems || cartItems.length <= 0) return clearInterval(timer);
      timer = setInterval(() => {
        if (isCartFetching) return;
        refetch();
      }, 10000);
    })();

    return () => {
      clearInterval(timer);
    };
  }, [ordreRefetch]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView className={`flex-1 bg-white px-2`}>
      {isCartLoading ? (
        <>
          <AddressCardSkeletop />
        </>
      ) : (
        <>
          <>
            <FlatList
              data={[""]}
              ListEmptyComponent={<EmptyBag message={"Your cart is empty"} />}
              renderItem={() => (
                <View className="pb-2 mb-20">
                  {productType === "rent" && (
                    <View className="border border-gray-300 rounded-md p-3">
                      <Text className="text-lg font-bold">Selected Center</Text>
                      <View>
                        {isCenterSelected ? (
                          <>
                            <Text className="text-[17px] mt-1">
                              {selectedCenterAddress?.centerName}
                            </Text>

                            <Text className="text-[16px] font-[poppins] my-1">{`${selectedCenterAddress?.address?.name}, ${selectedCenterAddress?.address?.streetName}, ${selectedCenterAddress?.address?.locality}, ${selectedCenterAddress?.address?.postalCode}, ${selectedCenterAddress?.address?.country}`}</Text>

                            <Text className="text-[17px] mb-1 font-semibold">
                              +91-{selectedCenterAddress?.user?.mobileNo}
                            </Text>
                          </>
                        ) : (
                          <Text className="text-[16px] font-[poppins]">
                            No Center Selected
                          </Text>
                        )}
                      </View>
                      <View className="mt-3">
                        <TouchableOpacity
                          onPress={handleChangeCenter}
                          disabled={isGlobalButtonDisabled}
                          className="flex items-center justify-center h-12 w-full bg-white border-orange-500 border-[2px] rounded-md">
                          <Text className="text-orange-500 font-bold text-md">
                            {isCenterSelected
                              ? "Change Center"
                              : "Select Center"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View className="flex-col mt-1 p-[13px] bg-white w-full border border-gray-300 rounded-md mb-3 gap-y-1 mt-1">
                    {amountDetails?.originalAmount && (
                      <View className="flex-row justify-between w-full">
                        <Text className="text-[18px]">Original Price: </Text>
                        <Text className="text-[18px]">
                          ₹{amountDetails.originalAmount}
                        </Text>
                      </View>
                    )}
                    {amountDetails?.discountedAmount && (
                      <View className="flex-row justify-between w-full">
                        <Text className="text-[18px]">Subtotal:</Text>
                        <Text className="text-[18px]">
                          ₹{amountDetails.discountedAmount}
                        </Text>
                      </View>
                    )}
                    {amountDetails?.shippingAmount && (
                      <View className="flex-row justify-between w-full">
                        <Text className="text-[18px]">Shpping Price:</Text>
                        <Text className="text-[18px]">
                          ₹{amountDetails.shippingAmount}
                        </Text>
                      </View>
                    )}
                    {amountDetails?.finalAmount && (
                      <View className="flex-row justify-between w-full">
                        <Text className="text-[18px] font-bold">
                          Total Price
                        </Text>
                        <Text className="text-[18px] font-bold">
                          ₹{amountDetails.finalAmount}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    className={
                      "flex-row justify-center items-center mt-1 p-[13px] bg-white w-full border border-gray-300 rounded-md mb-3"
                    }>
                    <TouchableOpacity
                      onPress={handleContinueClick}
                      disabled={productType === "rent" && !isCenterSelected}
                      style={{
                        opacity:
                          productType === "rent" && !isCenterSelected ? 0.3 : 1,
                      }}
                      className="h-12 rounded-md w-full items-center justify-center bg-green-600">
                      {isPlacingOrder ? (
                        <ActivityIndicator size={23} color="white" />
                      ) : (
                        <Text className="text-white text-md font-bold">
                          Place {productType === "rent" ? "Rent" : "Buy"} Order
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={cartItems}
                    renderItem={({ item }) => {
                      return <CartCard cart={item} />;
                    }}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              className={`flex-1 bg-white p-2`}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }></FlatList>
          </>
        </>
      )}

      {orderPlaceModalVisible && (
        <PlaceOrderModal
          modalVisible={orderPlaceModalVisible}
          setModalVisible={setOrderPlaceModalVisible}
          orderPlaceStatus={orderPlaceStatus}
        />
      )}
    </SafeAreaView>
  );
};

export default CartPage;
