import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";
import { setProductType } from "@store/rtk";
import { Stack, useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState, useTransition } from "react";

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
            <View className="w-screen flex items-center">
              <View className="flex flex-row h-8 rounded-md w-[40%] bg-gray-300 border border-gray-300 mt-1">
                <Pressable
                  onPress={() => {
                    handleChangeProductType("rent");
                  }}
                  className={`${locProductType === "rent" ? "bg-white" : ""} rounded-md w-[50%] flex items-center justify-center`}>
                  <Text>Rent</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleChangeProductType("buy");
                  }}
                  className={`${locProductType === "buy" ? "bg-white" : ""} rounded-md w-[50%] bg-none flex items-center justify-center`}>
                  <Text>Purchase</Text>
                </Pressable>
              </View>
              <View className="h-fit w-full px-3 mt-3">
                <Pressable
                  onPress={() => {
                    router.navigate("/search-page");
                  }}
                  className="w-full h-12 rounded-md border border-gray-300 flex-row items-center justify-between px-3 ">
                  <Text className="text-gray-500 font-semibold">
                    Seach Products
                  </Text>
                  <EvilIcons name="search" size={24} color="black" />
                </Pressable>
              </View>
            </View>

            <Categories />

            <View className="flex-1 w-screen min-h-screen mb-20">
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
