import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { EvilIcons } from "@expo/vector-icons";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import OrderItem from "../../components/OrderScreen/OrderItem";
import AddressCardSkeletop from "../../Skeletons/AddressCardSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const [isOrderFetching, setOrderFetching] = useState(true);
  const [paginationPage, setPaginationPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const getOrders = async (type = undefined) => {
    try {
      setOrderFetching(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/orders/${productType}?page=${paginationPage}&limit=20`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(response);
      if (!!response.data?.data && !type) {
        setOrders([...orders, ...response.data?.data]);
      } else setOrders(response.data?.data);
      setTotalPage(response.data?.totalPage || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setOrderFetching(false);
    }
  };

  const orderRefetch = useSelector((state) => state.order.orderRefetch);

  useEffect(() => {
    getOrders();
  }, [paginationPage, productType]);

  useEffect(() => {
    getOrders("cancel");
  }, [orderRefetch]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getOrders("cancel");
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className={`flex-1 bg-white p-2`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {isOrderFetching ? (
          <>
            <AddressCardSkeletop />
          </>
        ) : (
          <View className={`mb-4 p-2`}>
            {!orders || orders.length === 0 ? (
              <View className="flex justify-center items-center min-h-screen -mt-20">
                <Text className="text-lg">Your order list is empty</Text>
              </View>
            ) : (
              <>
                {orders?.map((item, index) => (
                  <OrderItem
                    key={index}
                    order={item}
                    productType={productType}
                    jwtToken={jwtToken}
                  />
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
