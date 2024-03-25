import { Link } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Product from "./Product";

import { useGetAllProductsQuery } from "@store/rtk/apis/productApi";
import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "@store/rtk/apis/wishlistApi";

function ProductsList({ title, bgColor, titleColor, viewAllPath }) {
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/products?productType=${viewAllPath}&limit=10`,
        // `${process.env.EXPO_PUBLIC_API_URL}/products?productType=${productType}&limit=10`,
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
          className={`w-[100%] p-[20px_10px] h-[100%] rounded`}>
          <View className="flex flex-row justify-between p-[0px_1px] items-center mb-[16px]">
            <Text
              style={{
                color: titleColor,
              }}
              className="font-[poppins-xbold] text-[22px]">
              {title}
            </Text>
            <Link
              className="text-[15px] text-purple font-[poppins-bold] underline"
              href={`/products?section=${viewAllPath}`}>
              See All
            </Link>
          </View>

          <View>
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
        </View>
      )}
    </>
  );
}

export default ProductsList;
