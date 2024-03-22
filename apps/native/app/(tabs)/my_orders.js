import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { EvilIcons } from "@expo/vector-icons";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import OrderItem from "../../components/OrderScreen/OrderItem";

const OrderScreen = () => {
  const [orderStatus, setOrderStatus] = useState("On Progress");

  const handleStatusChange = (status) => {
    setOrderStatus(status);
  };

  const orders = [
    {
      txnid: "dfj3adf3wafdj3",
      user: "nishalbarman",
      quantity: 12,
      previewUrl:
        "https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg",
      title: "Naruto",
      price: 342.23,
      shippingPrice: 0,
      orderType: "rent",
      rentReturnDueDate: "2024-03-18T13:41:55.646+00:00",
      rentDays: 13,
      orderStatus: "On Progress",
      paymentType: "Online",
      paymentStatus: "Done",
      trackingLink: null,
    },
    {
      txnid: "dfj3adf3wafdj3",
      user: "nishalbarman",
      previewUrl:
        "https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg",
      title: "Solo Leveling",
      price: 342.23,
      shippingPrice: 0,
      orderType: "buy",
      rentDays: null,
      orderStatus: "Accepted",
      paymentType: "Online",
      paymentStatus: "Done",
      trackingLink: null,
      quantity: 12,
    },
    {
      txnid: "dfj3adf3wafdj3",
      user: "nishalbarman",
      previewUrl:
        "https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg",
      title: "Battle through the heavens (S5)",
      price: 342.23,
      shippingPrice: 0,
      orderType: "buy",
      rentDays: null,
      orderStatus: "Delivered",
      paymentType: "Online",
      paymentStatus: "Done",
      trackingLink: null,
      quantity: 12,
    },
    {
      txnid: "dfj3adf3wafdj3",
      user: "nishalbarman",
      previewUrl:
        "https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg",
      title: "Jujutsu Kaisen",
      price: 342.23,
      shippingPrice: 0,
      orderType: "buy",
      rentDays: null,
      orderStatus: "Rejected",
      paymentType: "Online",
      paymentStatus: "Done",
      color: { title: "Red", _id: "colorid" },
      size: { title: "S", _id: "sizeid" },
      quantity: 12,
      trackingLink: null,
    },
  ];

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className={`flex-1 bg-white p-2`}>
        <View className={`mb-4 p-2`}>
          {!orders || orders.length === 0 ? (
            <View className="flex justify-center items-center">
              <Text className="text-lg">Your order list is empty</Text>
            </View>
          ) : (
            <>
              {orders?.map((item, index) => (
                <OrderItem key={index} order={item} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
