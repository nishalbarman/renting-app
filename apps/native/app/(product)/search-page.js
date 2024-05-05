import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { EvilIcons, Octicons } from "@expo/vector-icons";

import axios from "axios";

import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

function searchPage() {
  const { productType } = useSelector((state) => state.product_store);
  const { jwtToken } = useSelector((state) => state.auth);

  const router = useRouter();

  // inital product details needs to be loaded from server

  const [searchValue, setSearchValue] = useState("");

  const [isProductFetching, setIsProductFetching] = useState(true);
  const [isProductFetchError, setIsProductFetchError] = useState(false);
  const [error, setError] = useState(null);

  const [paginationPage, setPaginationPage] = useState(0);
  const [paginatinLimit, setPaginationLimit] = useState(10);
  const [productData, setProductData] = useState([]);

  console.log(productData);

  const handleError = (err) => {
    console.error(err);
    setError(err);
    setIsProductFetchError(true);
    if (err.res.status === 401) {
      router.dismissAll();
      router.replace(`/auth/login?redirectTo=/product?id=${productId}`);
    } else if (err.res.status === 400) {
      router.dismiss(1);
    } else if (err.res.status === 403) {
      console.error("Single Product Page Error-->", err?.res?.data?.message);
    }
  };

  const getProductData = async () => {
    try {
      //   setIsProductDataLoading(true);
      const url = new URL("/products", process.env.EXPO_PUBLIC_API_URL);

      url.searchParams.append("productType", productType);
      url.searchParams.append("page", paginationPage);
      url.searchParams.append("query", searchValue);
      url.searchParams.append("limit", 50);

      const res = await axios.get(url.href, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log(res.data.data);

      setProductData(res.data.data);
      setPaginationPage(res.data.totalPages);
    } catch (error) {
      handleError(error);
    } finally {
      // setIsProductDataLoading(false);
    }
  };

  const search = useRef();

  // AsyncStorage.clear();

  // get product list and feedback list
  useEffect(() => {
    (() => {
      if (!searchValue) return;

      search.current = setTimeout(async () => {
        clearTimeout(search.current);

        const oldSearchData =
          JSON.parse(await AsyncStorage.getItem("searchHistory")) || [];

        await AsyncStorage.setItem(
          "searchHistory",
          JSON.stringify([searchValue, ...oldSearchData])
        );
        setSearchHistory([searchValue, ...oldSearchData]);
        getProductData();
      }, 500);
    })();

    return () => {
      clearTimeout(search.current);
    };
  }, [searchValue]);

  const [searchHistory, setSearchHistory] = useState([]);

  const handleOnKeyPress = (event) => {
    const key = event.nativeEvent.key;
    // As I remember key for enter button is "Enter", but if not you can console.log(key) and hit enter to check the value
    // if (key === "Enter") {
    if (!searchValue) return;
    console.log("Keycliekd", searchValue);
    router.navigate({
      pathname: "/list",
      params: {
        searchValue: searchValue,
      },
    });
    // }
  };

  useEffect(() => {
    (async () => {
      const oldSearchData =
        JSON.parse(await AsyncStorage.getItem("searchHistory")) || [];

      setSearchHistory(oldSearchData);
    })();
  }, []);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          // headerBackVisible: false,
          headerTitle: () => {
            return (
              <View className="h-12 w-full border-none outline-none bg-white flex flex-row rounded-lg items-center">
                {/* <View>
                  <Pressable
                    onPress={() => {
                      if (!searchValue) return;
                      router.navigate({
                        pathname: "/list",
                        params: {
                          searchValue: searchValue,
                        },
                      });
                    }}
                    className="h-full w-12 bg-gray-200 flex items-center justify-center">
                    <EvilIcons name="search" size={24} color="black" />
                  </Pressable>
                </View> */}
                <TextInput
                  className="h-full w-full inline-block font-[poppins-mid] placeholder:text-[16px] items-center"
                  editable={true}
                  multiline={false}
                  inputMode="text"
                  placeholder="Search for products"
                  onSubmitEditing={handleOnKeyPress}
                  onChangeText={(text) => {
                    setSearchValue(text);
                  }}
                />
                {/* <View className="px-6">
                  <Pressable
                    onPress={() => {
                      if (!searchValue) return;
                      router.navigate({
                        pathname: "/list",
                        params: {
                          searchValue: searchValue,
                        },
                      });
                    }}
                    className="h-8 w-12 bg-indigo-500 flex items-center justify-center rounded-md">
                    <EvilIcons name="search" size={24} color="white" />
                  </Pressable>
                </View> */}
              </View>
            );
          },
        }}
      />

      <View className="w-full h-full"></View>
      <ScrollView>
        {productData.length > 0 ? (
          <View>
            {productData.map((item) => {
              return (
                <View className="w-full border-b border-gray-200">
                  <View>
                    <Octicons name="history" size={24} color="black" />
                    <Text>{item.title}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            {searchHistory.map((item) => {
              return (
                <View className="w-full border-b border-gray-200">
                  <View>
                    <Octicons name="history" size={24} color="black" />
                    <Text>{item}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default searchPage;
