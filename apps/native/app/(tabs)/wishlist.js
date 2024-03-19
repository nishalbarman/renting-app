import { View, FlatList, SafeAreaView, Text } from "react-native";

import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";
import WishlistCard from "../../components/Wishlist/WishlistCard";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import EmptyBag from "../../components/EmptyBag/EmptyBag";

export default function Tab() {
  const { productType } = useSelector((state) => state.product_store);
  console.log("Wishlist", productType);
  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isError: isWishlistDataError,
    error: wishlistDataError,
    refetch,
  } = useGetWishlistQuery();

  useEffect(() => {
    console.log("Doing refetching");
    refetch("Wishlist");
  }, [productType]);

  console.log("Wishlist data from wishlist tab ==>", wishlistData);

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      <View>
        <FlatList
          data={wishlistData}
          renderItem={({ item }) => {
            console.log("Wishlit product", item.product);
            return <WishlistCard details={item.product} />;
          }}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
