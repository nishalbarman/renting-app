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
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import CartItem from "../../components/CartItem/CartItem";
import { useGetAddressQuery } from "@store/rtk/apis/addressApi";

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

  const {
    data: address,
    isLoading: isAddressLoading,
    isFetching: isAddressFetching,
    error: addressFetchError,
  } = useGetAddressQuery();

  const handleAdressSheet = () => {
    if (address && address.length > 0) SheetManager.show("address-list-sheet");
    else SheetManager.show("add-address-sheet");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="rounded-lg bg-white p-[10px] pl-3 pr-3 pb-[30px]">
        <Text className="font-[poppins-bold] text-[23px] mb-3">Cart</Text>
        <TouchableOpacity
          onPress={handleAdressSheet}
          className="flex flex-row bg-[#F1F1F3] rounded-lg items-center justify-between p-3 h-[55px]">
          <View className="flex flex-row gap-x-1 items-center justify-center h-[100%]">
            <EvilIcons name="location" size={30} color="black" />
            <Text className="font-[poppins-mid] text-[17px] align-middle">
              Nalbari to kaithalkuchi road
            </Text>
          </View>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <CartItem cart={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        className={
          "flex-row justify-between items-center mt-[16px] p-[13px] bg-white"
        }>
        <Text className="text-[18px] font-bold">
          Total: ₹{calculateTotalPrice().toFixed(2)}
        </Text>
        <TouchableOpacity className="bg-dark-purple p-[12px_16px] rounded-[4px]">
          <Text className="text-white text-[16px] font-bold">Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
