import { Link, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Product from "./Product";

import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "@store/rtk";

function ProductsList({
  title,
  bgColor,
  titleColor,
  viewAllPath,
  sort = undefined,
}) {
  const router = useRouter();
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);

      const url = new URL(`${process.env.EXPO_PUBLIC_API_URL}/products`);

      url.searchParams.append("productType", viewAllPath);
      url.searchParams.append("limit", 10);

      if (!!sort) {
        url.searchParams.append("sort", sort);
      }

      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });
      // console.log(res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProductDataLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, [viewAllPath]);

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
    <>
      {isProductDataLoading || isWishlistDataLoading ? (
        <ProductsListSkeleton />
      ) : (
        <View
          style={{
            backgroundColor: bgColor,
          }}
          className={`w-full px-2 py-4`}>
          <View className="flex flex-row justify-between px-1 pr-3 items-center mb-4">
            <Text
              style={{
                color: titleColor,
              }}
              className="font-[poppins-xbold] tracking-wider text-lg">
              {title}
            </Text>
            <Pressable
              className={`h-7 px-2 bg-green-600 rounded-md items-center justify-center`}
              onPress={() => {
                router.navigate({
                  pathname: "/list",
                  params: {
                    defaultSort: sort,
                  },
                });
              }}>
              <Text className="text-[10px] tracking-wider text-white font-[poppins-bold]">
                Explore
              </Text>
            </Pressable>
          </View>

          <View className="bg-white rounded-md">
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Product
                  feedbackVisible={false}
                  details={item}
                  wishlistData={wishlistData}
                  wishlistIdMap={wishlistIdMap}
                />
              )}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      )}
    </>
  );
}

export default ProductsList;
