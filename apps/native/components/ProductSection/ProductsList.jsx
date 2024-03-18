import { Link } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Product from "./Product";

import { useGetAllProductsQuery } from "@store/rtk/apis/productApi";
import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";

function ProductsList({ title, bgColor, titleColor, viewAllPath }) {
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);
      const res = await axios.get(
        `http://192.168.147.210:8000/products?productType=${viewAllPath}&limit=10`,
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

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <>
      {isProductDataLoading ? (
        <ProductsListSkeleton />
      ) : (
        <View
          style={{
            backgroundColor: bgColor,
          }}
          className={`w-[100%] p-[20px_10px] h-fit rounded`}>
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
              renderItem={({ item }) => <Product details={item} />}
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
