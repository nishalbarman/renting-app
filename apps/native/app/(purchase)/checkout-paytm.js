import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import axios from "axios";
import handleGlobalError from "../../lib/handleError";
import { useGetCartQuery } from "@store/rtk";

import AllInOneSDKManager from "paytm_allinone_react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

export default function CheckoutRazorpay() {
  console.log("Paytm");

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
          `${process.env.EXPO_PUBLIC_API_URL}/paytm/cart/${productType}`,
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

      return response.data;
    } catch (error) {
      handleGlobalError(error);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { orderId, txnToken, amount } = await fetchPaymentSheetParams();
      console.log(orderId, txnToken, amount);

      const config = {
        orderId: orderId,
        mid: process.env.EXPO_PUBLIC_PAYTM_MID,
        txnToken: txnToken,
        amount: Number(amount).toFixed(2).toString(),
        callbackUrl:
          "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=" +
          orderId,
        isStaging: true,
        restrictAppInvoke: false,
        urlScheme:
          Constants.appOwnership === "expo"
            ? Linking.createURL("/--/")
            : Linking.createURL(""),
      };

      AllInOneSDKManager.startTransaction(
        config.orderId,
        config.mid,
        config.txnToken,
        config.amount,
        config.callbackUrl,
        config.isStaging,
        config.restrictAppInvoke,
        config.urlScheme
      )
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          handleGlobalError(err);
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
