import { Link, Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import Product from "../../components/ProductSection/Product";

import axios from "axios";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";

import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function ProductsList() {
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const [paginationPage, setPaginationPage] = useState(1);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/products?productType=${productType}&page=${paginationPage}&limit=50`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProductDataLoading(false);
    }
  };

  console.log("Product Data -->", data);

  useEffect(() => {
    getProductData();
  }, [productType]);

  const {
    data: wishlistData,
    isLoading: isWishlistDataLoading,
    isError: isWishlistDataError,
    error: wishlistDataError,
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Product Listing",
          headerShadowVisible: false,
        }}
      />
      {isProductDataLoading || isWishlistDataLoading ? (
        <ProductsListSkeleton />
      ) : (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
          className={`w-[100%] px-1 py-1 h-[100%] rounded`}>
          <View
            contentContainerStyle={{
              alignItems: "center",
            }}
            className="flex-row py-3 h-fit w-full"
            horizontal={true}>
            <View className="flex-row gap-x-[3px] h-[40px] ml-1 flex items-center justify-center w-fit px-3 py-2 rounded-2xl border border-gray-300 bg-white">
              <Text className=" text-black">Sort By</Text>
              <AntDesign name="down" size={15} color="black" />
            </View>
            <View className="flex-row gap-x-2 h-[40px] ml-1 flex items-center justify-center w-fit px-3 py-2 rounded-2xl border border-gray-300 bg-white">
              <FontAwesome name="sliders" size={15} color="black" />
              <Text className=" text-black">Filter</Text>
            </View>
            <View className="h-[40px] ml-1 flex items-center justify-center w-fit px-3 py-2 rounded-2xl border border-gray-300 bg-white">
              <Text className=" text-black">Category</Text>
            </View>
          </View>

          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Product
                details={item}
                wishlistData={wishlistData}
                wishlistIdMap={wishlistIdMap}
              />
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default ProductsList;
