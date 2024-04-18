import { Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import Product from "../../components/ProductSection/Product";

import axios from "axios";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "@store/rtk";

import ProductsListSkeleton from "../../Skeletons/ProductListSkeleton";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import ListFilter from "../../components/ProductList/ListFilter";
import { SheetManager } from "react-native-actions-sheet";

function ProductsList() {
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const { productType } = useSelector((state) => state.product_store);

  const { sort, filter, category, price } = useSelector(
    (state) => state.product_list
  );

  const [data, setData] = useState([]);
  const [isProductDataLoading, setIsProductDataLoading] = useState(true);

  const [paginationPage, setPaginationPage] = useState(0);

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
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProductDataLoading(false);
    }
  };

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

  useEffect(() => {
    SheetManager.show("product-sort-sheet");
  }, []);

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
            className="flex-row py-3 h-fit w-full">
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={true}
              data={[
                {
                  icon: () => <AntDesign name="down" size={15} color="black" />,
                  title: "Sort By",
                  iconPostion: "right",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
                {
                  icon: () => (
                    <FontAwesome name="sliders" size={15} color="black" />
                  ),
                  title: "Filter",
                  iconPostion: "left",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
                {
                  icon: () => (
                    <FontAwesome name="sliders" size={15} color="black" />
                  ),
                  title: "Category",
                  iconPostion: "left",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
                {
                  icon: () => (
                    <FontAwesome name="sliders" size={15} color="black" />
                  ),
                  title: "Price",
                  iconPostion: "left",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
                {
                  icon: () => (
                    <FontAwesome name="sliders" size={15} color="black" />
                  ),
                  title: "Price",
                  iconPostion: "left",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
                {
                  icon: () => (
                    <FontAwesome name="sliders" size={15} color="black" />
                  ),
                  title: "Price",
                  iconPostion: "left",
                  style: !sort
                    ? {
                        borderWidth: 4,
                        borderColor: "green",
                        backgroundColor: "white",
                      }
                    : undefined,
                },
              ]}
              renderItem={({ item }) => (
                <ListFilter
                  style={item?.style}
                  icon={item.icon}
                  iconPostion={item.iconPostion}
                  title={item.title}
                />
              )}
            />
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
