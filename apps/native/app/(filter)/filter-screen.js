import { Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import handleGlobalError from "../../lib/handleError";
import { useSelector } from "react-redux";

import Slider from "@react-native-community/slider";

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

import RadioGroup from "react-native-radio-buttons-group";

function FilterScreen() {
  const router = useRouter();

  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [choosedFilterType, setChoosedFilterType] = useState("category");
  const [choosedFilterTypeName, setChoosedFilterTypeName] =
    useState("Categories");

  const [allFilter, setAllFilter] = useState({});

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setAllFilter({ ...allFilter, category: response.data.categories || [] });
    } catch (error) {
      console.error("filter-screen -->");
      handleGlobalError(error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const filterOptions = React.useMemo(
    () => [
      {
        label: "Category",
        key: "category",
      },
      {
        label: "Color",
        key: "color",
      },
      {
        label: "Size",
        key: "size",
      },
      {
        label: "Price",
        key: "price",
      },
      {
        label: "Rating",
        key: "rating",
      },
      {
        label: "Discount",
        key: "discount",
      },
    ],
    []
  );

  const staticFilterOptions = useMemo(() => {
    return {
      priceStaticData: [
        {
          id: 0,
          label: "No Filter",
          value: null,
          // fillColor: "#ff7473",
          // unFillColor: "#fbbfbb",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 1,
          label: "0 - 100 Price",
          fillColor: "#5567e9",
          unFillColor: "#afb5f5",
          value: [0, 100],
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 2,
          label: "101 - 200 Price",
          value: [101, 200],
          fillColor: "#a98ae7",
          unFillColor: "#cab6f4",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 3,
          label: "201 - 300 Price",
          value: [201, 300],
          fillColor: "#fcb779",
          unFillColor: "#ffd1a7",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 4,
          label: "301 & Above",
          value: [301, -1],
          fillColor: "#2be055",
          unFillColor: "#cbf2d5",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
      ],
      ratingStaticData: [
        {
          id: 0,
          label: "No Filter",
          value: null,
          fillColor: "#ff7473",
          unFillColor: "#fbbfbb",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 1,
          label: "⭐️⭐️⭐️⭐️ & Up",
          value: 4,
          fillColor: "#5567e9",
          unFillColor: "#afb5f5",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 2,
          label: "⭐️⭐️⭐️ & Up",
          value: 3,
          fillColor: "#a98ae7",
          unFillColor: "#cab6f4",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 3,
          label: "⭐️⭐️ & Up",
          value: 2,
          fillColor: "#fcb779",
          unFillColor: "#ffd1a7",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 4,
          label: "⭐️ & Up",
          value: 1,
          fillColor: "#2be055",
          unFillColor: "#cbf2d5",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
      ],
      discountStaticData: [
        {
          id: 0,
          label: "No Filter",
          value: null,
          fillColor: "#ff7473",
          unFillColor: "#fbbfbb",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 1,
          label: "10 - 30 % Discount",
          value: [10, 30],
          fillColor: "#5567e9",
          unFillColor: "#afb5f5",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 2,
          label: "31 - 50 % Discount",
          value: [31, 50],
          fillColor: "#a98ae7",
          unFillColor: "#cab6f4",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 3,
          label: "51 - 70 % Discount",
          value: [51, 70],
          fillColor: "#fcb779",
          unFillColor: "#ffd1a7",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
        {
          id: 4,
          label: "71 - 100 % Discount",
          value: [71, 100],
          fillColor: "#2be055",
          unFillColor: "#cbf2d5",
          labelStyle: {
            color: "black",
            fontSize: 15,
          },
          containerStyle: radiobuttonStyle,
        },
      ],
    };
  }, []);

  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedRatingId, setSelectedRatingId] = useState(0);
  const [selectedDiscountId, setSelectedDiscountId] = useState(0);

  return (
    <SafeAreaView className="px-3 bg-white min-h-screen">
      <Stack.Screen
        options={{
          title: "Filter",
          headerTitleAlign: "center",
          headerShown: true,
          headerShadowVisible: false,
          headerBackTitle: false,
          headerBackVisible: false,
          headerStyle: {
            border: "1px solid black",
          },
          headerLeft: (props) => (
            <Pressable
              onPress={() => {
                if (props.canGoBack) router.dismiss();
              }}
              className="p-2 mr-3 border border-gray-200 rounded-full">
              <Ionicons name="chevron-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={[""]}
        className="flex w-full mt-2"
        renderItem={() => {
          return (
            <>
              <View className="w-full p-1">
                <Text className="mb-2 text-sm">
                  Choose: {choosedFilterTypeName}
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={filterOptions}
                  keyExtractor={(item, index) => index}
                  ItemSeparatorComponent={<View className="ml-2"></View>}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setChoosedFilterType(item.key);
                        setChoosedFilterTypeName(item.label);
                      }}
                      className={`w-[110px] h-20 mb-1 rounded-md items-center justify-center bg-gray-200 ${choosedFilterType === item.key ? "bg-green-500 border border-green-900" : ""}`}>
                      <Text
                        className={`text-sm font-[roboto-bold] ${choosedFilterType === item.key ? "text-white" : "text-black-900"}`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
              <View className="my-3">
                <Text className="text-sm">{choosedFilterTypeName}</Text>
              </View>
              <View className="w-full h-full">
                {choosedFilterType === "category" && (
                  <FlatList
                    data={allFilter[choosedFilterType] || []}
                    keyExtractor={(item, index) => index}
                    ListEmptyComponent={() => {
                      return (
                        <View className="w-full justify-center">
                          <Text className="text-md font-[roboto]">
                            No filter options available
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={({ item }) => (
                      <View>
                        <BouncyCheckbox
                          className="mb-3"
                          size={25}
                          fillColor="white"
                          unFillColor="#FFFFFF"
                          text={item.categoryName}
                          // textStyle={{ fontWeight: "bold", color: "black" }}
                          iconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                          }}
                          innerIconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                            borderWidth: 3, // does nothing
                            backgroundColor: "#34ab2e", // makes the area around and inside the checkbox red
                          }}
                          onPress={(isChecked) => {
                            console.log(isChecked);
                          }}
                        />
                      </View>
                    )}
                  />
                )}

                {choosedFilterType === "color" && (
                  <FlatList
                    data={
                      [
                        "Red",
                        "Blue",
                        "Green",
                        "Yellow",
                        "Purple",
                        "Orange",
                        "Black",
                        "White",
                      ] || []
                    }
                    keyExtractor={(item, index) => index}
                    ListEmptyComponent={() => {
                      return (
                        <View className="w-full justify-center">
                          <Text className="text-md font-[roboto]">
                            No filter options available
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={({ item }) => (
                      <View>
                        <BouncyCheckbox
                          className="mb-3"
                          size={25}
                          fillColor="black"
                          // unFillColor="#FFFFFF"
                          text={item}
                          // textStyle={{ fontWeight: "bold", color: "black" }}
                          iconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                            backgroundColor:
                              item.toLowerCase() === "white"
                                ? "black"
                                : item.toLowerCase() === "black"
                                  ? "white"
                                  : item.toLowerCase(), // makes the area around and inside the checkbox red
                          }}
                          innerIconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                            borderWidth: 3, // does nothing
                            backgroundColor:
                              item.toLowerCase() === "white"
                                ? "black"
                                : item.toLowerCase() === "black"
                                  ? "white"
                                  : item.toLowerCase(), // makes the area around and inside the checkbox red
                          }}
                          onPress={(isChecked) => {
                            console.log(isChecked);
                          }}
                        />
                      </View>
                    )}
                  />
                )}

                {choosedFilterType === "size" && (
                  <FlatList
                    data={["S", "M", "L", "XL"] || []}
                    keyExtractor={(item, index) => index}
                    ListEmptyComponent={() => {
                      return (
                        <View className="w-full justify-center">
                          <Text className="text-md font-[roboto]">
                            No filter options available
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={({ item }) => (
                      <View>
                        <BouncyCheckbox
                          className="mb-3"
                          size={25}
                          fillColor="white"
                          // unFillColor="#FFFFFF"
                          text={item}
                          // textStyle={{ fontWeight: "bold", color: "black" }}
                          iconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                            borderWidth: 1, // does nothing
                            backgroundColor: "#34ab2e", // makes the area around and inside the checkbox red
                            borderColor: "#34ab2e", // does nothing
                            borderStyle: "dotted", // does nothing
                          }}
                          innerIconStyle={{
                            height: 35, // changes the hitspace but not the checkbox itself
                            width: 35,
                            borderWidth: 3, // does nothing
                            backgroundColor: "#34ab2e", // makes the area around and inside the checkbox red
                          }}
                          onPress={(isChecked) => {
                            console.log(isChecked);
                          }}
                        />
                      </View>
                    )}
                  />
                )}

                {choosedFilterType === "price" && (
                  <RadioGroup
                    containerStyle={radiogroupStyle}
                    radioButtons={staticFilterOptions.priceStaticData}
                    onPress={(id) => setSelectedPrice(id)}
                    selectedId={selectedPrice}
                  />
                )}

                {choosedFilterType === "rating" && (
                  <RadioGroup
                    containerStyle={radiogroupStyle}
                    radioButtons={staticFilterOptions.ratingStaticData}
                    onPress={(id) => setSelectedRatingId(id)}
                    selectedId={selectedRatingId}
                  />
                )}

                {choosedFilterType === "discount" && (
                  <RadioGroup
                    containerStyle={radiogroupStyle}
                    radioButtons={staticFilterOptions.discountStaticData}
                    onPress={(id) => setSelectedDiscountId(id)}
                    selectedId={selectedDiscountId}
                  />
                )}

                {/* <View className="w-full mt-2">
                  <Pressable className="bg-green-600 w-full h-12 flex items-center justify-center rounded-md">
                    <Text className="text-white text-sm font-bold">Apply Filter</Text>
                  </Pressable>
                </View> */}
              </View>
            </>
          );
        }}></FlatList>
    </SafeAreaView>
  );
}

export default FilterScreen;

const radiogroupStyle = StyleSheet.create({
  flex: 1,
  flexDirection: "column",
  alignContents: "between",
  justifyContents: "between",
  width: "100%",
});

const radiobuttonStyle = StyleSheet.create({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "start",
  gap: 10,
  width: "100%",
});
