import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { Octicons } from "@expo/vector-icons";

import axios from "axios";

import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

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

        getProductData();
      }, 500);
    })();

    return () => {
      clearTimeout(search.current);
    };
  }, [searchValue]);

  const [searchHistory, setSearchHistory] = useState([]);

  const setHistory = async (value) => {
    const oldSearchData =
      JSON.parse(await AsyncStorage.getItem("searchHistory")) || [];

    setSearchHistory([value, ...oldSearchData]);

    AsyncStorage.setItem(
      "searchHistory",
      JSON.stringify([value, ...oldSearchData])
    );
  };

  const handleOnKeyPress = async () => {
    // const key = event.nativeEvent.key;
    // As I remember key for enter button is "Enter", but if not you can console.log(key) and hit enter to check the value
    if (!searchValue) return;
    await setHistory(searchValue);
    router.navigate({
      pathname: "/list",
      params: {
        searchValue: searchValue,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const oldSearchData =
        JSON.parse(await AsyncStorage.getItem("searchHistory")) || [];

      setSearchHistory(oldSearchData);
    })();
  }, []);

  const [searchBarFocus, setSearchBarFocus] = useState();

  console.log(searchValue);

  return (
    <SafeAreaView className="bg-white min-h-screen">
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Seach",
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerSearchBarOptions: {
            placeholder: "Search",
            autoFocus: true,
            onFocus: () => {
              setSearchBarFocus(true);
            },
            onBlur: () => {
              setSearchBarFocus(false);
            },
            onChangeText: (e) => {
              setSearchValue(e.nativeEvent.text);
            },
            onSearchButtonPress: (e) => {
              handleOnKeyPress();
            },
          },
          // headerBackVisible: true,
          // headerTitle: () => {
          //   return (
          //     // <View className="h-12 border w-full border-none outline-none bg-white rounded-lg items-center">
          //     <TextInput
          //       className="h-full w-full font-[poppins-mid] placeholder:text-[16px] items-center"
          //       editable={true}
          //       multiline={false}
          //       inputMode="text"
          //       autoFocus={true}
          //       placeholder="Search for products"
          //       onSubmitEditing={handleOnKeyPress}
          //       onChangeText={(text) => {
          //         setSearchValue(text);
          //       }}
          //     />
          //     /* <View className="px-6">
          //         <Pressable
          //           onPress={() => {
          //             if (!searchValue) return;
          //             router.navigate({
          //               pathname: "/list",
          //               params: {
          //                 searchValue: searchValue,
          //               },
          //             });
          //           }}
          //           className="h-8 w-12 bg-indigo-500 flex items-center justify-center rounded-md">
          //           <EvilIcons name="search" size={24} color="white" />
          //         </Pressable>
          //       </View> */
          //     // </View>
          //   );
          // },
        }}
      />

      {searchBarFocus ? (
        <ScrollView className="">
          {productData.length > 0 &&
            productData.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  className="px-3 py-3 w-full flex-row items-center border-b border-[1px] border-gray-200 bg-white"
                  onPress={() => {
                    setHistory(item.title);
                    setSearchValue(item.title);
                    router.navigate({
                      pathname: "/list",
                      params: {
                        searchValue: item.title,
                      },
                    });
                  }}>
                  <Image
                    source={{
                      uri: item.previewImage,
                    }}
                    className="w-10 h-10"
                    contentPosition={"center"}
                  />
                  <Text className="ml-3 text-md">{item.title}</Text>
                </Pressable>
              );
            })}

          {productData.length > 0 && (
            <View className="my-2 border border-b border-gray-200"></View>
          )}

          {searchHistory.length > 0 &&
            searchHistory.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  className="px-3 py-3 w-full flex-row items-center border-b border-[1px] border-gray-200 bg-white"
                  onPress={async () => {
                    setSearchValue(item);
                    router.navigate({
                      pathname: "/list",
                      params: {
                        searchValue: item,
                      },
                    });
                  }}>
                  <Octicons name="history" size={24} color="black" />
                  <Text className="ml-3 text-md">{item}</Text>
                </Pressable>
              );
            })}
        </ScrollView>
      ) : (
        <View className="w-full h-full bg-white items-center justify-center">
          <Text>Click on the search icon to search something</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default searchPage;
