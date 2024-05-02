import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import PlaceOrderModal from "../../modal/Cart/PlaceRentOrderModal";
import { useGetCartQuery } from "@store/rtk/apis/cartApi";

export default function AddressList() {
  const searchParams = useLocalSearchParams();

  const { refetch: refetchCart } = useGetCartQuery();

  const { name, mobileNo, email, jwtToken } = useSelector(
    (state) => state.auth
  );
  const { productType } = useSelector((state) => state.product_store);

  selectedAddress = searchParams?.address;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(true);

  const [orderStatus, setOrderStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderError, setOrderError] = useState("");

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/stripe/cart/${productType}`,
      { address: selectedAddress },
      {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "RentKaro",
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
    });

    console.log("Error ->", error);

    if (error) {
      console.error("Error ->", error);
      Alert.alert(`Transaction Failed`, error.message);
    }
  };

  const openPaymentSheet = async () => {
    try {
      setOrderStatus("pending");
      setPaymentLoading(true);
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      setIsModalVisible(true);

      if (error) {
        console.error("Error ->", error);
        setOrderStatus("failed");
        setOrderError(error);
      } else {
        setOrderStatus("success");
      }
    } catch (error) {
      console.error(error);
    }
    // finally {
    //   setPaymentLoading(false);
    // }
  };

  useEffect(() => {
    openPaymentSheet();
  }, []);

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
          <ActivityIndicator size={35} />
          <Text className="mt-4">
            Please do not close or do not press back button..
          </Text>
        </View>
      </SafeAreaView>
      {paymentLoading && (
        <PlaceOrderModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
          orderPlaceStatus={orderStatus}
          errorMsg={orderError?.message}
        />
      )}
    </>
  );
}
