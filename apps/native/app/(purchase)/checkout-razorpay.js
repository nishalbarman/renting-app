import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import axios from "axios";
import handleGlobalError from "../../lib/handleError";
import { orderRefetch, useGetCartQuery } from "@store/rtk";

import RazorpayCheckout from "react-native-razorpay";

import CrafterLogo from "../../assets/appIcons/logo.png";

export default function CheckoutRazorpay() {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  const { jwtToken } = useSelector((state) => state.auth);

  const { productType } = useSelector((state) => state.product_store);

  const { refetch: refetchCart } = useGetCartQuery(productType);

  const fetchPaymentSheetParams = async () => {
    try {
      let response;

      if (searchParams?.checkoutSingleOrCart === "CART") {
        response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/pay/razorpay/cart/${productType}`,
          { address: searchParams?.address },
          {
            headers: {
              authorization: `Bearer ${jwtToken}`,
            },
          }
        );
      } else {
        //   response = await axios.post(
        //     `${process.env.EXPO_PUBLIC_API_URL}/stripe/single/purchase/${productType}`,
        //     {
        //       address: searchParams?.address,
        //       productId: searchParams?.productId,
        //       productVariantId: searchParams?.filteredVariantId,
        //       quantity: searchParams?.quantity,
        //     },
        //     {
        //       headers: {
        //         authorization: `Bearer ${jwtToken}`,
        //       },
        //     }
        //   );
        return;
      }

      console.log("I am new here -->", response.data);

      return response.data;
    } catch (error) {
      handleGlobalError(error);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { razorpayOrderId, amount, name, email, mobileNo, productinfo } =
        await fetchPaymentSheetParams();

      const options = {
        // description: productinfo,
        // image: CrafterLogo,
        currency: "INR",
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY,
        amount: amount,
        name: "Crafter",
        order_id: razorpayOrderId, //Replace this with an order_id created using Orders API.
        prefill: {
          email: email,
          contact: mobileNo,
          name: name,
        },
        theme: { color: "#100D11" },
      };
      RazorpayCheckout.open(options)
        .then((data) => {
          // handle success
          console.log(`Success: ${data.razorpay_payment_id}`);
          refetchCart();
          orderRefetch();
          router.dismissAll();
          router.navigate("my_orders");
        })
        .catch((error) => {
          // handle failure
          console.error(`Error: ${error.code} | ${error.description}`);
          handleGlobalError(
            new Error(JSON.parse(error.description).error.description)
          );
          router.dismiss();
          router.navigate("cart");
        });
    } catch (error) {
      console.error(error);
      //   handleGlobalError(error);
      return router.dismiss();
    }
  };

  const placeRentOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/renting/rent?centerId=${searchParams?.centerAddressId}`,
        {},
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      // console.log("What the response-->", response);

      if (response.status == 200) {
        router.replace({
          pathname: "order-placed",
          params: {
            paymentTransactionId: response.data.paymentTransactionId,
          },
        });
        // setOrderPlaceStatus("success");
        refetchCart();
      }
    } catch (error) {
      console.error(error);
      handleGlobalError(error);
    }
  };

  useEffect(() => {
    if (!searchParams?.checkoutType) return;

    if (searchParams?.checkoutType === "buy") {
      openPaymentSheet();
    } else {
      placeRentOrder();
    }
  }, [searchParams.checkoutType]);

  return (
    <>
      <SafeAreaView className="bg-white">
        <Stack.Screen
          options={{
            headerShown: false,
            headerShadowVisible: false,
          }}
        />
        <View className="min-h-screen flex-1 items-center justify-center">
          <ActivityIndicator color={"black"} size={35} />
          <Text className="mt-4 text-center text-sm">
            Please do not close or do not press back button..
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
