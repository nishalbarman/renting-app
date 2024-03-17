import { View, Text, FlatList, SafeAreaView } from "react-native";

import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";
import Product from "../../components/ProductSection/Product";

export default function Tab() {
  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isError: isWishlistDataError,
    error: wishlistDataError,
  } = useGetWishlistQuery();

  console.log("Wishlist data from wishlist tab ==>", wishlistData);

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      <View>
        <FlatList
          data={wishlistData}
          renderItem={({ item }) => {
            console.log("Wishlit product", item?.product);
            return <Product details={item?.product} />;
          }}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
