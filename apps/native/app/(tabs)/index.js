import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";

export default function Tab() {
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
        <Categories />
        <View className="flex-1 w-[100%]">
          <ProductsList
            title="✌️ Rent Products"
            viewAllPath="rent"
            bgColor="#fff9f2"
            titleColor="black"
          />
          <ProductsList
            title="😍 Buy Products"
            viewAllPath="buy"
            bgColor="#f5fffd"
            titleColor="black"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
