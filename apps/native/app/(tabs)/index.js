import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";
import { setProductType, useGetCartQuery } from "@store/rtk";
import { Stack, useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState, useTransition } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

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

  const { data: cartItems } = useGetCartQuery(productType);

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
            <View className="h-fit px-3 mt-3 flex-row justify-between items-center">
              <View>
                <Text className="font-[roboto-bold] text-2xl">Discover</Text>
              </View>
              <Pressable
                onPress={() => {
                  router.navigate({
                    pathname: "cart",
                  });
                }}
                className="ml-2 items-center justify-center h-12 w-12 rounded-md">
                <View
                  className={
                    "w-6 h-6 items-center justify-center z-[999] rounded-full bg-green-600 absolute right-0 top-0"
                  }>
                  <Text className="text-[12px] text-white">
                    {cartItems?.length || 0}
                  </Text>
                </View>
                {/* <FontAwesome size={24} name="shopping-cart" color={"black"} /> */}
                <Ionicons name="bag-handle-outline" size={24} color="black" />
              </Pressable>
            </View>

            <View className="h-fit px-3 mt-3 flex-row items-center">
              <Pressable
                onPress={() => {
                  router.navigate("/search-page");
                }}
                className="h-12 flex-grow rounded-md border border-gray-300 flex-row items-center justify-between px-3 ">
                <Text className="text-gray-500 font-[roboto]">
                  Seach Products
                </Text>
                <EvilIcons name="search" size={24} color="black" />
              </Pressable>
              {/* <Pressable className="ml-2 items-center justify-center h-12 w-12 rounded-md border border-gray-300">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                />
              </Pressable> */}
            </View>

            <Categories />

            <View className="flex-1 mt-3 w-screen min-h-screen">
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
