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

const CartPage = () => {
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
                <TouchableOpacity className="bg-dark-purple p-[12px_16px] rounded-[4px]">
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
