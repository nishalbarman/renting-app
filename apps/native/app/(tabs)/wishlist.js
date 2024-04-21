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
    isFetching: isWishlistDataFetching,
    isError: isWishlistDataError,
    error: wishlistDataError,
    refetch,
  } = useGetWishlistQuery(productType);

  console.log("Wishlist items -->", wishlistData);

  useEffect(() => {
    refetch();
  }, [productType]);

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      {isWishlistDataLoading || isWishlistDataFetching ? (
        <ProductListSkeleton />
      ) : (
        <View>
          {!!wishlistData && wishlistData.length > 0 ? (
            <FlatList
              data={wishlistData}
              renderItem={({ item }) => {
                return item?.product ? (
                  <WishlistCard
                    wishlistId={item?._id}
                    details={item?.product}
                    productType={productType}
                  />
                ) : (
                  <></>
                );
              }}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <EmptyBag message={"Your wishlist is empty"} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
