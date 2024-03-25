import { View, FlatList, SafeAreaView, Text } from "react-native";

import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";
import WishlistCard from "../../components/Wishlist/WishlistCard";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import EmptyBag from "../../components/EmptyBag/EmptyBag";
import ProductListSkeleton from "../../Skeletons/ProductListSkeleton";

export default function Tab() {
  const { productType } = useSelector((state) => state.product_store);

  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isError: isWishlistDataError,
    error: wishlistDataError,
    refetch,
  } = useGetWishlistQuery(productType);

  console.log(wishlistData);

  useEffect(() => {
    refetch();
  }, [productType]);

  console.log("Wishlist data from wishlist tab ==>", wishlistData);

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      {isWishlistDataLoading ? (
        <ProductListSkeleton />
      ) : (
        <View>
          {!!wishlistData && wishlistData.length > 0 ? (
            <FlatList
              data={wishlistData}
              renderItem={({ item }) => {
                console.log("Wishlit product", item?.product);
                return <WishlistCard details={item?.product} />;
              }}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <EmptyBag />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
