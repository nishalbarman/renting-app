import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import HorizontalProductsList from "../../components/ProductSection/HorizontalProductsList";
import Categories from "../../components/CategoryList/Categories";
import { useGetCartQuery } from "@store/rtk";
import { useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Ionicons } from "@expo/vector-icons";

export default function Tab() {
  const { productType } = useSelector((state) => state.product_store);

  const router = useRouter();

  const { data: cartItems } = useGetCartQuery(productType);

  return (
    <SafeAreaView className="bg-white">
      <FlatList
        decelerationRate="normal"
        scrollEventThrottle={16}
        initialNumToRender={10}
        removeClippedSubviews={true}
        className="w-full"
        contentContainerStyle={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        data={[""]}
        renderItem={() => (
          <>
            <View className="h-fit px-3 mt-3 flex-row justify-between items-center">
              <View>
                <Text className="font-[roboto-bold] text-xl">CRAFTER</Text>
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
                    "w-6 h-6 items-center justify-center z-[999] rounded-full bg-green-600 bg-black absolute right-0 top-0"
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
                style={{
                  elevation: 0.7,
                }}
                className="h-12 flex-grow rounded-md flex-row items-center justify-between px-3 bg-gray-100">
                <Text className="text-gray-500 text-[15px] font-[roboto]">
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

            <View className="flex-1 mt-3 w-screen">
              <HorizontalProductsList
                title={`🔥 Popular`}
                viewAllPath={productType}
                bgColor="#def9ff"
                titleColor="black"
                sort={"popular"}
              />
              <HorizontalProductsList
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
