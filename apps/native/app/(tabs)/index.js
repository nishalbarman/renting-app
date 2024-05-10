import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";
import { setProductType } from "@store/rtk";
import { Stack, useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState, useTransition } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Tab() {
  const [isLoading, startTransition] = useTransition();

  const { productType } = useSelector((state) => state.product_store);

  const [locProductType, setProductLocType] = useState(productType);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChangeProductType = (type) => {
    setProductLocType(type);
    startTransition(() => {
      dispatch(setProductType(type));
    });
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        className="w-full"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        data={[""]}
        renderItem={() => (
          <>
            <View className="h-fit px-3 mt-3 flex-row items-center">
              <Pressable
                onPress={() => {
                  router.navigate("/search-page");
                }}
                className="h-12 flex-grow rounded-md border border-gray-300 flex-row items-center justify-between px-3 ">
                <Text className="text-gray-500 font-[poppins]">
                  Seach Products
                </Text>
                <EvilIcons name="search" size={24} color="black" />
              </Pressable>
              <Pressable className="ml-2 items-center justify-center h-12 w-12 rounded-md border border-gray-300">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
              <Pressable className="ml-2 items-center justify-center h-12 w-12 rounded-md border border-gray-300">
                <Ionicons name="bag-handle-outline" size={24} color="black" />
              </Pressable>
            </View>

            <Categories />

            <View className="flex-1 mt-3 w-screen min-h-screen mb-20">
              <ProductsList
                title={`🔥 Popular`}
                viewAllPath={productType}
                bgColor="#def9ff"
                titleColor="black"
                sort={"popular"}
              />
              <ProductsList
                title={`✌️ Our Products`}
                viewAllPath={productType}
                bgColor="#fff9f2"
                // bgColor="#f2f2f2"
                titleColor="black"
              />
            </View>
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}
