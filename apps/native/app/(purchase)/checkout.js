import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

import { Stack, useRouter } from "expo-router";

import { useSelector } from "react-redux";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import PlaceOrderModal from "../../modal/Cart/PlaceRentOrderModal";

export default function AddressList() {
  const { name, mobileNo, email, jwtToken } = useSelector(
    (state) => state.auth
  );
  const { productType } = useSelector((state) => state.product_store);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentLoading, setPaymentLoading] = useState(true);

  const [orderStatus, setOrderStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [isSheetReady, setIsSheetReady] = useState(false);

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
      setPaymentLoading(true);
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();
      console.log("Presented");

      if (error) {
        console.error("Error ->", error);
        setOrderStatus("failed");
        setIsModalVisible(true);
        setOrderError(error);
      } else {
        setOrderStatus("success");
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    openPaymentSheet();
  }, []);

  //   const handlePaymentOpen = async () => {
  //     openPaymentSheet();
  //   };

  return (
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          title: "CheckOut",
          headerShown: false,
          headerShadowVisible: false,
        }}
      />

      {paymentLoading && (
        <PlaceOrderModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
          orderPlaceStatus={orderStatus}
          errorMsg={orderError?.message}
        />
      )}
    </SafeAreaView>
  );
}
