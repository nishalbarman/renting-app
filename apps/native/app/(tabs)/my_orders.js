import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import OrderItem from "../../components/OrderScreen/OrderItem";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";

import EmptyBag from "../../components/EmptyBag/EmptyBag";
import { EvilIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const OrderScreen = () => {
  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [isOrderFetching, setIsOrderFetching] = useState(false);
  const [paginationPage, setPaginationPage] = useState(0);
  const [orders, setOrders] = useState([]);

  // console.log("Order list length -->", orders.length);

  const [paginationTotalPages, setPaginationTotalPages] = useState(0);
  const [paginationLimit, setPaginationLimit] = useState(5);

  const getInitialOrder = useCallback(
    async ({ productType, paginationPage, searchValue }) => {
      try {
        setIsOrderLoading(true);

        const url = new URL(
          `/orders/l/${productType}`,
          process.env.EXPO_PUBLIC_API_URL
        );
        url.searchParams.append("page", paginationPage);
        url.searchParams.append("limit", paginationLimit);

        if (searchValue) {
          url.searchParams.append("q", searchValue);
        }

        const response = await axios.get(url.href, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setOrders(response.data?.data);
        setPaginationTotalPages(response.data?.totalPage || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsOrderLoading(false);
      }
    },
    []
  );

  const fetchMoreOrders = useCallback(
    async ({ productType, paginationPage, searchValue }) => {
      try {
        // If paginationPage is 0 then inititalOrder function will be called not this one.
        if (paginationPage === 0) return;

        setIsOrderFetching(true);

        const url = new URL(
          `/orders/l/${productType}`,
          process.env.EXPO_PUBLIC_API_URL
        );
        url.searchParams.append("page", paginationPage);
        url.searchParams.append("limit", paginationLimit);

        if (searchValue) {
          url.searchParams.append("q", searchValue);
        }

        const response = await axios.get(url.href, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!!response.data?.data) {
          setOrders((prev) => {
            return [...prev, ...response.data?.data];
          });
          setPaginationTotalPages(response.data?.totalPage || 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsOrderFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMoreOrders({
      productType,
      paginationPage,
      searchValue: orderSearchValue,
    });
  }, [paginationPage]);

  const orderRefetch = useSelector((state) => state.refetch.orderRefetch);

  useEffect(() => {
    setPaginationPage(0);
    getInitialOrder({ productType, paginationPage });
  }, [orderRefetch, productType]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setPaginationPage(0);
    await getInitialOrder({ productType, paginationPage: 0 });
    setRefreshing(false);
  }, [productType, paginationPage]);

  const handleFetchNextPage = React.useCallback(() => {
    if (paginationPage < paginationTotalPages - 1) {
      setPaginationPage((prev) => prev + 1);
    }
  }, [paginationPage, paginationTotalPages]);

  const ListEndLoader = React.useCallback(() => {
    if (paginationPage < paginationTotalPages - 1) {
      return (
        <View className="py-3 items-center justify-center">
          <ActivityIndicator size={30} color="black" />
          <Text className="text-center text-sm mt-2">
            Please wait while loading...
          </Text>
        </View>
      );
    } else return null;
  }, [paginationPage, paginationTotalPages]);

  const [orderSearchValue, setOrderSearchValue] = useState("");

  const orderSearchRef = useRef();

  useEffect(() => {
    clearTimeout(orderSearchRef?.current);
    orderSearchRef.current = setTimeout(() => {
      getInitialOrder({
        productType,
        paginationPage,
        searchValue: orderSearchValue,
      });
    }, 200);

    return () => {
      clearTimeout(orderSearchRef?.current);
    };
  }, [orderSearchValue]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearTimeout(orderSearchRef?.current);
      };
    }, [])
  );

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      {isOrderLoading ? (
        <View className="min-h-full items-center justify-center">
          <ActivityIndicator size={35} color="black" />
          {/* <AddressCardSkeletop /> */}
        </View>
      ) : (
        <>
          {(!orders || orders.length === 0) && !orderSearchValue ? (
            <EmptyBag message={"Your order list is empty"} />
          ) : (
            <>
              <View
                style={{
                  elevation: 0.7,
                }}
                className="h-12 flex-row rounded-md flex-row items-center justify-between px-3 bg-white border border-gray-200 mb-1 mx-2">
                <TextInput
                  value={orderSearchValue}
                  onChangeText={setOrderSearchValue}
                  className="placeholder:text-gray-500 text-black h-full font-[roboto-mid] text-[15px] flex-grow"
                  placeholder="Seach Order"
                />
                <EvilIcons name="search" size={24} color="black" />
              </View>
              <FlatList
                className={`bg-white px-2`}
                data={orders || []}
                ListEmptyComponent={() => (
                  <View className="mt-10">
                    <Text className="text-center text-sm text-[#000000] font-[roboto-mid]">
                      No results found
                    </Text>
                  </View>
                )}
                renderItem={({ item, index }) => (
                  <OrderItem
                    key={item.id || index}
                    order={item}
                    productType={productType}
                    jwtToken={jwtToken}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={handleFetchNextPage}
                onEndReachedThreshold={0.8}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
              />
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderScreen;
