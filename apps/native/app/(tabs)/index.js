import { FlatList, Pressable, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";
import ProductsList from "../../components/ProductSection/ProductsList";
import Categories from "../../components/CategoryList/Categories";
import { setProductType } from "@store/rtk";

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
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        ounces={false} // Set this to false to disable overscroll effect
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 10,
          flexGrow: 1,
        }}> */}
      <FlatList
        className="w-screen"
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
              <View className="flex flex-row h-9 rounded-md w-[40%] bg-[#ebebeb] border border-gray-300">
                <Pressable
                  onPress={handleProductTypeRent}
                  className={`${productType === "rent" ? "bg-white" : ""} rounded-md w-[50%] flex items-center justify-center`}>
                  <Text>Rent</Text>
                </Pressable>
                <Pressable
                  onPress={handleProductTypePurchase}
                  className={`${productType === "buy" ? "bg-white" : ""} rounded-md w-[50%] bg-none flex items-center justify-center`}>
                  <Text>Purchase</Text>
                </Pressable>
              </View>
            </View>

            <Categories />

            <View className="flex-1 w-screen min-h-screen">
              <ProductsList
                title={`✌️ Our Products`}
                viewAllPath={productType}
                // bgColor="#fff9f2"
                bgColor="#f2f2f2"
                titleColor="black"
              />
            </View>
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
