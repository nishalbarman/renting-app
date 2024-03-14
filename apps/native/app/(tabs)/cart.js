import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { EvilIcons } from "@expo/vector-icons";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

export default function Cart() {
  const data = [
    {
      _id: "65f1eb08dd964b2b01a2ee85",
      previewUrl:
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
      title: "AK-900 Wired Keyboard",
      category: "65f1eb08dd964b2b01a2ee43",
      showPictures: [
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
        "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1707091200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pkS0Fjkyo3qutdpGQbWBrNmMbMG6S8sBK5aQJg96FZnXZnjiDnf3ZLSIZmiheaT5dOHp-baEatT82TR5ON5M7TU05cF9sC194Y3CE~GOB-k5s4dq2KsvpgT~NSZGVVSIUDzr6SYGpnOLxiHXFzxT0giIrcHrbauxD2nMywLD5RTb-lkjZHj2dZCuALwo9xL-UqZEIENuqfbSNPMARl0zoVVQg~AQ23O63QvliTxMSQDxsAetFq0MV-2-wkUyE2t-oVZpZcAu~MNqH9dyJYnI2VPp2v9va5Hu0agY5oWvjhBTRM0bX9GVrsJn1Ug4wnEx-VM4VcshefTc21M37JEUYQ__",
      ],
      description:
        "<p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul>",
      isPurchasable: true,
      rentingPrice: 100,
      starts: 4,
      totalFeedbacks: 100,
      shippingPrice: 23,
      availableStocks: 100,
      originalPrice: 65,
      discountedPrice: 30,
      isVarientAvailable: false,
      quantity: 2,
    },
    {
      _id: "65f1eb08dd964b2b01a2ee85",
      previewUrl:
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
      title: "AK-900 Wired Keyboard",
      category: "65f1eb08dd964b2b01a2ee43",
      showPictures: [
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
        "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1707091200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pkS0Fjkyo3qutdpGQbWBrNmMbMG6S8sBK5aQJg96FZnXZnjiDnf3ZLSIZmiheaT5dOHp-baEatT82TR5ON5M7TU05cF9sC194Y3CE~GOB-k5s4dq2KsvpgT~NSZGVVSIUDzr6SYGpnOLxiHXFzxT0giIrcHrbauxD2nMywLD5RTb-lkjZHj2dZCuALwo9xL-UqZEIENuqfbSNPMARl0zoVVQg~AQ23O63QvliTxMSQDxsAetFq0MV-2-wkUyE2t-oVZpZcAu~MNqH9dyJYnI2VPp2v9va5Hu0agY5oWvjhBTRM0bX9GVrsJn1Ug4wnEx-VM4VcshefTc21M37JEUYQ__",
      ],
      description:
        "<p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul>",
      isPurchasable: true,
      rentingPrice: 100,
      starts: 4,
      totalFeedbacks: 100,
      shippingPrice: 23,
      availableStocks: 100,
      originalPrice: 65,
      discountedPrice: 30,
      isVarientAvailable: false,
      quantity: 2,
    },

    {
      _id: "65f1eb08dd964b2b01a2ee85",
      previewUrl:
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
      title: "AK-900 Wired Keyboard",
      category: "65f1eb08dd964b2b01a2ee43",
      showPictures: [
        "https://storage.googleapis.com/crafter-ecommerce.appspot.com/images/products/262b021d-4afd-48c6-aed3-41cbdc1c3e68",
        "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1707091200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pkS0Fjkyo3qutdpGQbWBrNmMbMG6S8sBK5aQJg96FZnXZnjiDnf3ZLSIZmiheaT5dOHp-baEatT82TR5ON5M7TU05cF9sC194Y3CE~GOB-k5s4dq2KsvpgT~NSZGVVSIUDzr6SYGpnOLxiHXFzxT0giIrcHrbauxD2nMywLD5RTb-lkjZHj2dZCuALwo9xL-UqZEIENuqfbSNPMARl0zoVVQg~AQ23O63QvliTxMSQDxsAetFq0MV-2-wkUyE2t-oVZpZcAu~MNqH9dyJYnI2VPp2v9va5Hu0agY5oWvjhBTRM0bX9GVrsJn1Ug4wnEx-VM4VcshefTc21M37JEUYQ__",
      ],
      description:
        "<p>Well designed comfortable to wear material, no money no problem you can now rent out this item easily without any hassle. Just click once and buy instantly.</p> <h5><strong>About the product</strong></h5> <ul> <li>Very comfortable to wear</li> <li>Less price than the market</li> <li>Best quality</li> <li>You can buy the item if you also want to take it.</li> </ul>",
      isPurchasable: true,
      rentingPrice: 100,
      starts: 4,
      totalFeedbacks: 100,
      shippingPrice: 23,
      availableStocks: 100,
      originalPrice: 65,
      discountedPrice: 30,
      isVarientAvailable: false,
      quantity: 2,
    },
  ];

  const handlers = useScrollHandlers();
  const addressActionSheetRef = useRef(null);

  const calculateTotalPrice = () => {
    return data.reduce(
      (total, item) => total + item.discountedPrice * item.quantity,
      0
    );
  };

  const renderCartItem = ({ item }) => (
    <View className="mb-[10px] flex-row bg-white p-[10px] rounded-lg shadow ml-2 mr-2">
      <Image
        source={{ uri: item.previewUrl }}
        className="w-[80px] h-[80px] mr-5"
      />
      <View className="flex-1">
        <Text numberOfLines={2} className="text-[15px] font-[poppins-mid]">
          {item.title}
        </Text>

        <View className="flex flex-row justify-between items-start gap-y-1 p-[0px_10px]">
          {/* price */}
          <View className="flex gap-y-2">
            {item.buyOrRent === "buy" ? (
              <Text className="text-[20px] font-[poppins-bold]">
                ₹1799{" "}
                <Text className="text-[15px] text-[#787878] font-[poppins] line-through">
                  ₹2799
                </Text>
              </Text>
            ) : (
              <Text className="text-[18px] font-[poppins-bold]">
                ₹179
                <Text className="text-[13px] font-[poppins-bold]"> / Day</Text>
              </Text>
            )}
          </View>

          {/* quantity section */}
          <View className="flex flex-col gap-y-2 items-end">
            <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-end">
              <TouchableOpacity
                onPress={() => {}}
                className="rounded-full w-[24px] h-[24px] flex flex items-center justify-center bg-white">
                <AntDesign name="minus" size={15} color="black" />
              </TouchableOpacity>
              <Text className="font-[poppins-bold] text-[15px] mr-4 ml-4">
                {item.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => {}}
                className="rounded-full w-[22px] h-[22px] flex flex items-center justify-center bg-white">
                <AntDesign name="plus" size={15} color="black" />
              </TouchableOpacity>
            </View>

            {!item.buyOrRent === "rent" && (
              <View className="flex flex-row bg-[#F2F3F2] justify-center items-center p-[8px] rounded-[30px] self-start">
                <TouchableOpacity
                  onPress={() => {
                    setRentDays((prev) => (prev == 1 ? 1 : prev - 1));
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="minus" size={15} color="black" />
                </TouchableOpacity>

                <Text className="font-[poppins-xbold] text-[18px] mr-4 ml-4">
                  {rentDays}
                  {"  "}
                  <Text className="font-[poppins-bold] text-[15px]">Day</Text>
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setRentDays((prev) => (prev >= 50 ? 50 : prev + 1));
                  }}
                  className="rounded-full w-[37px] h-[37px] flex flex items-center justify-center bg-white">
                  <AntDesign name="plus" size={10} color="black" />
                </TouchableOpacity>
              </View>
            )}

            {/* <View>
              {item.availableStocks === 0 || quantity > item.availableStocks ? (
                <Text className="text-[13px] text-[#d12626] font-[poppins-bold]">
                  Out of stock
                </Text>
              ) : (
                <Text className="text-[13px] text-[#32a852] font-[poppins-bold]">
                  ({item.availableStocks} items) In stock
                </Text>
              )}
            </View> */}
          </View>
        </View>
      </View>
    </View>
  );

  const handleAdressSheet = () => {
    console.log("Clicling");
    addressActionSheetRef?.current?.show();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="rounded-lg bg-white p-[10px] pl-3 pr-3 pb-[30px]">
        <Text className="font-[poppins-bold] text-[23px] mb-3">Cart</Text>
        <TouchableOpacity
          onPress={handleAdressSheet}
          className="flex flex-row bg-[#F1F1F3] rounded-lg items-center justify-between p-3 h-[55px]">
          <View className="flex flex-row gap-x-1 items-center justify-center">
            <EvilIcons name="location" size={30} color="black" />
            <Text className="font-[poppins-mid] text-[17px]">
              Nalbari to kaithalkuchi road
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCartItem}
      />
      <View
        className={
          "flex-row justify-between items-center mt-[16px] p-[13px] bg-white"
        }>
        <Text className="text-[18px] font-bold">
          Total: £{calculateTotalPrice().toFixed(2)}
        </Text>
        <TouchableOpacity className="bg-dark-purple p-[12px_16px] rounded-[4px]">
          <Text className="text-white text-[16px] font-bold">Checkout</Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        closeOnPressBack={true}
        gestureEnabled={true}
        ref={addressActionSheetRef}>
        <NativeViewGestureHandler
          simultaneousHandlers={handlers.simultaneousHandlers}>
          <ScrollView {...handlers}>
            <View className="pt-8 flex flex-col items-center gap-y-5 pb-10">
              <Text className="font-[poppins-bold] text-[21px]">
                What is your rate?
              </Text>

              <View className="pl-10 pr-10 pt-4">
                <Text className="font-[poppins-mid] text-[18px] text-center">
                  Please share your opinion about the product
                </Text>
              </View>

              <View className={"w-[90%] border rounded-lg"}>
                <TextInput
                  multiline={true}
                  className={`h-[250px] shadow-lg text-black p-4 placeholder:text-[18px] text-[18px] font-[poppins-mid]`}
                  placeholder="Your review"
                  placeholderTextColor={"grey"}
                />
              </View>
              <TouchableOpacity className="flex items-center justify-center w-[200px] h-[52px] p-[0px_20px] bg-[#d875ff] rounded-lg">
                <Text className="text-white font-bold">Add Address</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </NativeViewGestureHandler>
      </ActionSheet>
    </SafeAreaView>
  );
}
