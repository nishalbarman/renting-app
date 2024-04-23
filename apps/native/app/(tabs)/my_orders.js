import React, { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, RefreshControl, FlatList } from "react-native";
import OrderItem from "../../components/OrderScreen/OrderItem";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";

import EmptyBag from "../../components/EmptyBag/EmptyBag";

const OrderScreen = () => {
  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const [isOrderFetching, setOrderFetching] = useState(true);
  const [paginationPage, setPaginationPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const getOrders = useCallback(
    async ({ productType, paginationPage, clearAll = false }) => {
      try {
        setOrderFetching(true);
        console.log(productType);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/orders/l/${productType}?page=${paginationPage}&limit=20`,
          {
            headers: {
              authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!!response.data?.data && !clearAll) {
          setOrders([...orders, ...response.data?.data]);
        } else setOrders(response.data?.data);
        setTotalPage(response.data?.totalPage || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setOrderFetching(false);
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
    await getOrders({ productType, paginationPage, clearAll: true });
    setRefreshing(false);
  }, [productType, paginationPage]);

  return (
    <SafeAreaView className={`flex-1 bg-white px-2`}>
      {isOrderFetching ? (
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
              className={`flex-1 bg-white p-2`}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderScreen;
