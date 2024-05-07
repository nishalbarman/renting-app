import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Product from "../../components/ProductSection/Product";

import axios from "axios";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "@store/rtk";

import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";

import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
// import ListFilter from "../../components/ProductList/ListFilter";
import { SheetManager } from "react-native-actions-sheet";

function ProductsList() {
  const searchParams = useLocalSearchParams();

  console.log(searchParams);

  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const {
    sort: { value: sortingValue },
    filter,
  } = useSelector((state) => state.sort_filter_products);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const [paginationPage, setPaginationPage] = useState(0);
  const [paginationTotalPages, setPaginationTotalPages] = useState(0);
  // const [paginationLimit, setPaginationLimit] = useState(50);

  const getIntitalProductData = useCallback(
    async (sort = undefined, filter = undefined) => {
      try {
        setIsProductDataLoading(true);
        const url = new URL("/products", process.env.EXPO_PUBLIC_API_URL);
        url.searchParams.append("productType", productType);
        url.searchParams.append("page", paginationPage);
        url.searchParams.append("limit", 50);

        if (!!searchParams.category) {
          url.searchParams.append("category", searchParams.category);
        }

        if (!!searchParams.searchValue) {
          url.searchParams.append("query", searchParams.searchValue);
        }

        if (!!sort) {
          url.searchParams.append("sort", sort);
        }

        if (!!filter) {
          console.log(filter);
          url.searchParams.append(
            "filter",
            encodeURIComponent(JSON.stringify(filter))
          );
        }

        const res = await axios.get(url.href, {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        });

        setData(res.data.data);
        setPaginationTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsProductDataLoading(false);
      }
    },
    [productType, paginationPage, searchParams]
  );

  const fetchMoreProductData = useCallback(
    async (sort = undefined, filter = undefined) => {
      try {
        // setIsProductDataLoading(true);
        const url = new URL("/products", process.env.EXPO_PUBLIC_API_URL);
        url.searchParams.append("productType", productType);
        url.searchParams.append("page", paginationPage);
        url.searchParams.append("limit", 50);

        if (!!searchParams.category) {
          url.searchParams.append("category", searchParams.category);
        }

        if (!!searchParams.searchValue) {
          url.searchParams.append("query", searchParams.searchValue);
        }

        if (!!sort) {
          url.searchParams.append("sort", sort);
        }

        if (!!filter) {
          console.log(filter);
          url.searchParams.append(
            "filter",
            encodeURIComponent(JSON.stringify(filter))
          );
        }

        const res = await axios.get(url.href, {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        });

        if (res?.data?.data) {
          setData((prev) => [...prev, ...res?.data?.data]);
          setPaginationTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // setIsProductDataLoading(false);
      }
    },
    [productType, paginationPage, searchParams]
  );

  useEffect(() => {
    fetchMoreProductData(sortingValue, filter);
  }, [paginationPage]);

  useEffect(() => {
    getIntitalProductData(sortingValue, filter);
  }, [productType, sortingValue, filter]);

  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    // isError: isWishlistDataError,
    // error: wishlistDataError,
    refetch,
  } = useGetWishlistQuery();

  useEffect(() => {
    refetch();
  }, [productType]);

  const wishlistIdMap = useMemo(() => {
    const wishlistObjectWithIDAsKey = {};
    wishlistData?.forEach((item) => {
      wishlistObjectWithIDAsKey[item?.product?._id] = item?._id; // assigning product id as key and wishlist item id as value
    });
    return wishlistObjectWithIDAsKey;
  }, [wishlistData]);

  const handleProductSortSheetOpen = () => {
    SheetManager.show("product-sort-sheet");
  };

  const handleFetchNextPage = () => {
    if (paginationPage < paginationTotalPages - 1) {
      setPaginationPage((prev) => prev + 1);
    }
  };

  const ListEndLoader = () => {
    if (paginationPage < paginationTotalPages - 1) {
      return (
        <View className="my-2">
          <ActivityIndicator size={30} color="black" />
        </View>
      );
    } else return null;
  };

  const router = useRouter();

  console.log(data);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title:
            searchParams.categoryName ||
            searchParams.searchValue ||
            "Our Products",
          headerShadowVisible: false,
          headerRight: () => {
            return (
              <Pressable
                onPress={() => {
                  if (!searchParams.searchValue) return;
                  router.navigate({
                    pathname: "/search-page",
                    params: {
                      searchValue: searchParams.searchValue,
                    },
                  });
                }}
                className="h-8 w-12 flex items-center justify-center rounded-md">
                <EvilIcons name="search" size={27} color="black" />
              </Pressable>
            );
          },
        }}
      />
      {isProductDataLoading || isWishlistDataLoading ? (
        <ProductsListSkeleton />
      ) : (
        <View className={`w-full h-full rounded bg-[rgba(0,0,0,0.1)]`}>
          {data.length > 0 && (
            <View className="flex-row h-fit w-full border-b border-10 border-gray-200">
              <View className="flex flex-row justify-between items-center w-full bg-gray-20 mb-1 border-t border-gray-200">
                <Pressable
                  onPress={handleProductSortSheetOpen}
                  className="h-12 bg-white flex-1 flex-row gap-x-2 items-center justify-center border-l border-gray-200">
                  <FontAwesome name="sliders" size={15} color="black" />
                  <Text>Sort</Text>
                </Pressable>
                <Pressable className="h-12 bg-white flex-1 flex-row gap-x-1 items-center justify-center">
                  <AntDesign name="down" size={15} color="black" />
                  <Text>Filter</Text>
                </Pressable>
              </View>
            </View>
          )}

          <FlatList
            data={data}
            ListEmptyComponent={() => {
              return (
                <View className="h-screen w-full items-center justify-center">
                  <Text>No products found</Text>
                </View>
              );
            }}
            renderItem={({ item }) => (
              <Product
                details={item}
                wishlistData={wishlistData}
                wishlistIdMap={wishlistIdMap}
              />
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleFetchNextPage}
            onEndReachedThreshold={0.8}
            ListFooterComponent={ListEndLoader} // Loader when loading next page.
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default ProductsList;
