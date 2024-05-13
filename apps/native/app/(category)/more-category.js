import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";

import axios from "axios";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";

import EmptyBag from "../../components/EmptyBag/EmptyBag";
import handleGlobalError from "../../lib/handleError";
import CategoryItem from "../../components/CategoryList/CategoryItem";
import CategorySkeleton from "../../Skeletons/CategorySkeleton";

function MoreCategory() {
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [data, setData] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  const [paginationPage, setPaginationPage] = useState(0);
  const [paginationTotalPages, setPaginationTotalPages] = useState(0);

  const getInitialCategoryData = useCallback(async () => {
    try {
      console.log("Running intital category -->");
      setIsCategoryLoading(true);
      const url = new URL("/categories", process.env.EXPO_PUBLIC_API_URL);
      url.searchParams.append("page", paginationPage);
      url.searchParams.append("limit", 20);

      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      setData(res.data.categories);
      setPaginationTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("more-category.js -->");
      handleGlobalError(error);
    } finally {
      setIsCategoryLoading(false);
    }
  }, [paginationPage, jwtToken]);

  const fetchMoreCategoryData = useCallback(async () => {
    try {
      if (paginationPage === 0) return;
      console.log("Running get more category -->");
      const url = new URL("/categories", process.env.EXPO_PUBLIC_API_URL);
      url.searchParams.append("page", paginationPage);
      url.searchParams.append("limit", 50);

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
      console.error("more-category --> line 80");
      handleGlobalError(error);
    }
  }, [paginationPage, jwtToken]);

  useEffect(() => {
    fetchMoreCategoryData();
  }, [paginationPage]);

  useEffect(() => {
    getInitialCategoryData();
  }, []);

  //   const {
  //     data: wishlistData,
  //     isLoading: isWishlistDataLoading,
  //     // isError: isWishlistDataError,
  //     // error: wishlistDataError,
  //     refetch,
  //   } = useGetWishlistQuery();

  //   useEffect(() => {
  //     refetch();
  //   }, [productType]);

  //   const wishlistIdMap = useMemo(() => {
  //     const wishlistObjectWithIDAsKey = {};
  //     wishlistData?.forEach((item) => {
  //       wishlistObjectWithIDAsKey[item?.product?._id] = item?._id; // assigning product id as key and wishlist item id as value
  //     });
  //     return wishlistObjectWithIDAsKey;
  //   }, [wishlistData]);

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

  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width
  );
  const itemWidth = 90; // Width of each item

  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", updateWidth);
  }, []);

  const calculateNumCols = () => {
    const orientation =
      containerWidth > Dimensions.get("window").height
        ? "LANDSCAPE"
        : "PORTRAIT";
    const cols =
      orientation === "PORTRAIT"
        ? Math.floor(containerWidth / itemWidth)
        : Math.floor(containerWidth / itemWidth / 2); // Assuming you want two columns in landscape
    return cols > 0 ? cols : 1; // Ensure at least 1 column
  };

  return (
    <SafeAreaView className="px-2 bg-white">
      <Stack.Screen
        options={{
          title: "All Categories",
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerBackTitle: false,
          headerBackVisible: false,
          headerLeft: (props) => (
            <Pressable
              onPress={() => {
                if (props.canGoBack) router.dismiss();
              }}
              className="p-2 mr-3 border border-gray-200 rounded-full">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      {isCategoryLoading ? (
        <>
          <FlatList
            className="px-2"
            data={[
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ]}
            ListEmptyComponent={() => {
              return <EmptyBag message={"No Category found"} />;
            }}
            renderItem={({ item }) => <CategorySkeleton />}
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <View className={`w-full h-full rounded bg-[rgba(0,0,0,0.1)]`}>
          <View className="flex-row flex-wrap justify-center">
            {data.map((item) => {
              return (
                <CategoryItem
                  grow={1}
                  mt={8}
                  key={item?._id}
                  categoryId={item?._id}
                  categoryImageUrl={item?.categoryImageUrl}
                  categoryName={item?.categoryName}
                  categoryKey={item?.categoryKey}
                />
              );
            })}
          </View>
          {/* <FlatList
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            className="px-2"
            data={data}
            ListEmptyComponent={() => {
              return (
                <View className="self-center items-center">
                  <EmptyBag message={"No Category found"} />
                </View>
              );
            }}
            renderItem={({ item }) => (
              <CategoryItem
                key={item?._id}
                categoryId={item?._id}
                categoryImageUrl={item?.categoryImageUrl}
                categoryName={item?.categoryName}
                categoryKey={item?.categoryKey}
              />
            )}
            ItemSeparatorComponent={() => {
              <View className="mt-3 h-3"></View>;
            }}
            numColumns={calculateNumCols() - 1}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleFetchNextPage}
            onEndReachedThreshold={0.8}
            ListFooterComponent={ListEndLoader} // Loader when loading next page.
          /> */}
        </View>
      )}
    </SafeAreaView>
  );
}

export default MoreCategory;
