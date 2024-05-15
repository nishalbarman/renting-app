import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import handleGlobalError from "../../lib/handleError";
import { useGetCartQuery } from "@store/rtk";
// import PlaceOrderModal from "../../modal/Cart/PlaceRentOrderModal";
// import { useGetCartQuery } from "@store/rtk";

export default function AddressList() {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  const { name, mobileNo, email, jwtToken } = useSelector(
    (state) => state.auth
  );

  const { productType } = useSelector((state) => state.product_store);

  let selectedUserAddress = searchParams?.address;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(true);

  const [orderStatus, setOrderStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderError, setOrderError] = useState("");

  const { refetch: refetchCart } = useGetCartQuery(productType);

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/stripe/cart/${productType}`,
      { address: selectedUserAddress },
      {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
      paymentTxnId,
    } = response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
      paymentTxnId,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
      paymentTxnId,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: process.env.EXPO_MERCHANT_DISPLAY_NAME || "Savero",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      googlePay: {
        merchantCountryCode: "IN",
        testEnv: true, // use test environment
      },
      defaultBillingDetails: {
        name: name,
        email: email,
        mobile: mobileNo,
      },
      returnURL: "native://stripe-redirect",

      // theming related code

      appearance: {
        colors: {
          light: { primary: "#2b8038" },
          dark: { primary: "#2b8038" },
        },
        primaryButton: {
          colors: {
            light: { background: "#2b8038" },
            dark: { background: "#2b8038" },
          },
        },
      },
    });

    if (error) {
      console.error("Error ->", error);
      handleGlobalError(error);
      return router.dismiss();
      // return Alert.alert(`Transaction Failed`, error.message);
    }

    return paymentTxnId;
  };

  const openPaymentSheet = async () => {
    try {
      setOrderStatus("pending");
      setPaymentLoading(true);
      const paymentTransactionId = await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      setIsModalVisible(true);

      if (error) {
        console.error("Error ->", error);
        // setOrderStatus("failed");
        handleGlobalError(error);
        return router.dismiss();
        // setOrderError(error);
      } else {
        // console.log("TXN OD--.", paymentTransactionId);
        router.replace({
          pathname: "/order-placed",
          params: {
            paymentTransactionId: paymentTransactionId,
          },
        });
        // setOrderStatus("success");
      }
    } catch (error) {
      console.error(error);
      handleGlobalError(error);
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
          <ActivityIndicator color={"green"} size={35} />
          <Text className="mt-4 text-center text-sm">
            Please do not close or do not press back button..
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
