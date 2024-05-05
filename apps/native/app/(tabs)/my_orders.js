import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import OrderItem from "../../components/OrderScreen/OrderItem";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";

import EmptyBag from "../../components/EmptyBag/EmptyBag";

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

  const getOrders = useCallback(
    async ({ productType, paginationPage, clearAll = false }) => {
      console.log("fetching orders ", paginationPage);
      try {
        if (paginationPage === 0) {
          setIsOrderLoading(true);
        } else {
          setIsOrderFetching(true);
        }

        const url = new URL(
          `/orders/l/${productType}`,
          process.env.EXPO_PUBLIC_API_URL
        );
        url.searchParams.append("page", paginationPage);
        url.searchParams.append("limit", paginationLimit);

        const response = await axios.get(url.href, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!!response.data?.data && !clearAll) {
          setOrders([...orders, ...response.data?.data]);
        } else setOrders(response.data?.data);
        setPaginationTotalPages(response.data?.totalPage || 0);
      } catch (error) {
        console.error(error);
      } finally {
        if (paginationPage === 0) {
          setIsOrderLoading(false);
        } else {
          setIsOrderFetching(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    getOrders({ productType, paginationPage, clearAll: false });
  }, [paginationPage]);

  const orderRefetch = useSelector((state) => state.order.orderRefetch);

  useEffect(() => {
    getOrders({ productType, paginationPage, clearAll: true });
  }, [orderRefetch, productType]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setPaginationPage(0);
    await getOrders({ productType, paginationPage, clearAll: true });
    setRefreshing(false);
  }, [productType, paginationPage]);

  const handleFetchNextPage = React.useCallback(() => {
    if (paginationPage < paginationTotalPages - 1) {
      console.log("Updating pagination for orders");
      setPaginationPage((prev) => prev + 1);
    }
  }, [paginationPage, paginationTotalPages]);

  const ListEndLoader = React.useCallback(() => {
    if (paginationPage < paginationTotalPages - 1) {
      return (
        <View className="my-4">
          <ActivityIndicator size={45} color="black" />
        </View>
      );
    } else return null;
  }, [paginationPage, paginationTotalPages]);

  return (
    <SafeAreaView className={`flex-1 bg-white px-2`}>
      {isOrderLoading ? (
        <AddressCardSkeletop />
      ) : (
        <>
          {!orders || orders.length === 0 ? (
            <EmptyBag message={"Your order list is empty"} />
          ) : (
            <FlatList
              data={[""]}
              renderItem={() => (
                <View className={`mb-4 p-2`}>
                  {orders?.map((item, index) => (
                    <OrderItem
                      key={index}
                      order={item}
                      productType={productType}
                      jwtToken={jwtToken}
                    />
                  ))}
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              className={`flex-1 bg-white`}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={handleFetchNextPage}
              onEndReachedThreshold={0.8}
              ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderScreen;
