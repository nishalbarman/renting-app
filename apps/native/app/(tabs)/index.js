import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";
import { setProductType } from "@store/rtk/slices/storeTypeSlice";

export default function Tab() {
  const { productType } = useSelector((state) => state.product_store);

  const dispatch = useDispatch();

  const handleProductTypeRent = () => {
    dispatch(setProductType("rent"));
  };

  const handleProductTypePurchase = () => {
    dispatch(setProductType("buy"));
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        ounces={false} // Set this to false to disable overscroll effect
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 10,
          flexGrow: 1,
        }}>
        <View className="flex flex-row gap-x-3 justify-center px-8 mt-5">
          <TouchableOpacity
            onPress={handleProductTypeRent}
            className={`${productType === "rent" ? "bg-[#4587de]" : "bg-white"} flex flex-row rounded-lg items-center justify-center h-[41px] w-[50%]  border border-gray-300`}>
            <Text
              className={`${productType === "rent" ? "text-white" : "text-black"} text-[17px] font-extrabold`}>
              Rent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleProductTypePurchase}
            className={`${productType === "buy" ? "bg-[#3bc489]" : "bg-white"} flex flex-row rounded-lg items-center justify-center h-[41px] w-[50%]  border border-gray-300`}>
            <Text
              className={`${productType === "buy" ? "text-white" : "text-black"} text-[17px] font-extrabold`}>
              Purchase
            </Text>
          </TouchableOpacity>
        </View>

        <Categories />

        <View className="flex-1 w-[100%]">
          <ProductsList
            title={`✌️ Our Products`}
            viewAllPath={productType}
            bgColor="#fff9f2"
            titleColor="black"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
