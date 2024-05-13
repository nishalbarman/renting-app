import React, { useEffect, useState } from "react";
import Product from "../ProductSection/Product";
import { FlatList } from "react-native";
import { useGetWishlistQuery } from "@store/rtk";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import handleGlobalError from "../../lib/handleError";
import axios from "axios";

function RelatedProduct({ query }) {
  const router = useRouter();
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const productType = useSelector((state) => state.product_store.productType);

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const getProductData = async () => {
    try {
      setIsProductDataLoading(true);

      const url = new URL(`${process.env.EXPO_PUBLIC_API_URL}/products`);

      url.searchParams.append("productType", productType);
      url.searchParams.append("limit", 10);
      url.searchParams.append("query", query);

      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });
      setData(res.data.data);
    } catch (error) {
      console.error(error);
      handleGlobalError(error);
    } finally {
      setIsProductDataLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const {
    data: wishlistData,
    isLoading,
    isError,
    error,
  } = useGetWishlistQuery();

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <Product width={205} details={item} wishlistData={wishlistData} />
      )}
      numColumns={1}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default RelatedProduct;
