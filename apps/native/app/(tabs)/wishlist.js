import { View, FlatList, SafeAreaView, RefreshControl } from "react-native";

import { useGetWishlistQuery } from "@store/rtk";
import WishlistCard from "../../components/Wishlist/WishlistCard";

import { useSelector } from "react-redux";
import { memo, useCallback, useEffect } from "react";
import EmptyBag from "../../components/EmptyBag/EmptyBag";
import ProductListSkeleton from "../../Skeletons/ProductListSkeleton";
import { useFocusEffect } from "expo-router";

export default memo(function Tab() {
  const { productType } = useSelector((state) => state.product_store);

  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isFetching: isWishlistDataFetching,
    isError: isWishlistDataError,
    error: wishlistDataError,
    refetch,
  } = useGetWishlistQuery();

  console.log("Wishlist error-->", wishlistDataError);

  useFocusEffect(
    useCallback(() => {
      refetch();

      return () => {};
    }, [])
  );

  // useEffect(() => {
  //   refetch();
  // }, [productType]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isWishlistDataLoading ? (
        <ProductListSkeleton />
      ) : (
        <View>
          {!!wishlistData && wishlistData.length > 0 ? (
            <FlatList
              className="px-2"
              refreshControl={<RefreshControl onRefresh={refetch} />}
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
            <EmptyBag message="Your wishlist is empty" />
          )}
        </View>
      )}
    </SafeAreaView>
  );
});
