import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { EvilIcons } from "@expo/vector-icons";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import { useGetCartQuery } from "@store/rtk/apis/cartApi";
import { useSelector } from "react-redux";
import CartCard from "../../components/CartItem/CartCard";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";

import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";

const CartPage = () => {
  const { jwtToken } = useSelector((state) => state.auth);
  const { productType } = useSelector((state) => state.product_store);

  const {
    data: cartItems,
    isLoading: isCartLoading,
    isFetching: isCartFetching,
    error: cartFetchError,
    refetch,
  } = useGetCartQuery(productType);

  console.log("Cart Items -->>", cartItems);

  const calculateTotalPrice = () => {
    return (
      cartItems?.reduce(
        (total, item) =>
          total +
          (item?.variant?.discountedPrice || item?.discountedPrice) *
            item?.quantity,
        0
      ) || 0
    );
  };

  useEffect(() => {
    console.log("refetching", productType);
    refetch();
  }, [productType]);

  // before that need to check if default address is available or not
  // need to show stocks
  // on the server need to check stocks for all items if one item does not have stock we should not add that.
  const handlePurchaseClick = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/pay/razorpay/create-cart-order/${productType}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const razorpayOrder = response.data.payment;

      console.log("Got the response for order creation -->", razorpayOrder);

      const options = {
        description:
          "Online purchase for " +
          razorpayOrder.productinfo +
          " on renting officical",
        image: "https://i.imgur.com/3g7nmJC.jpg",
        currency: "INR",
        key: process.env.RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        name: razorpayOrder.name,
        order_id: razorpayOrder.razorpayOrderId, //Replace this with an order_id created using Orders API.
        prefill: {
          email: razorpayOrder.email,
          contact: razorpayOrder.mobileNo,
          name: razorpayOrder.name,
        },
        theme: { color: "#53a20e" },
      };

      console.log("Razorpaycheckout", RazorpayCheckout);

      RazorpayCheckout.open(options)
        .then((data) => {
          // handle success
          console.log(`Success: ${data.razorpay_payment_id}`);
        })
        .catch((error) => {
          console.error(error);
          // handle failure
          console.log(`Error: ${error.code} | ${error.description}`);
        });
    } catch (error) {
      console.error("Cart Error Razor Pay Payment", error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      {/* <ScrollView
        showsHorizontalScrollIndicator={false}
        className={`flex-1 bg-white p-2`}> */}
      <View className="mx-3">
        {isCartFetching || isCartLoading ? (
          <>
            <AddressCardSkeletop />
          </>
        ) : (
          <>
            {!cartItems || cartItems.length === 0 ? (
              <View className="flex justify-center items-center h-[100%]">
                <Text className="text-lg">Your cart is empty</Text>
              </View>
            ) : (
              <FlatList
                data={cartItems}
                renderItem={({ item }) => {
                  return <CartCard cart={item} />;
                }}
                numColumns={1}
                keyExtractor={(item, index) => index.toString()}
              />
            )}

            {cartItems?.length > 0 && (
              <View
                className={
                  "flex-row justify-between items-center mt-[16px] p-[13px] bg-white w-full"
                }>
                <Text className="text-[18px] font-bold">
                  Total: ₹{calculateTotalPrice().toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={handlePurchaseClick}
                  className="bg-dark-purple p-[12px_16px] rounded-[4px]">
                  <Text className="text-white text-[16px] font-bold">
                    Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default CartPage;
