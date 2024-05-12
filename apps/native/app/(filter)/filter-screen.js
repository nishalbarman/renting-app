import { Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Pressable,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import handleGlobalError from "../../lib/handleError";
import { useSelector } from "react-redux";

function FilterScreen() {
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [choosedFilterType, setChoosedFilterType] = useState("category");

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
    ],
    []
  );

  const router = useRouter();
  // console.log(choosedFilterType);
  // console.log(allFilter[choosedFilterType]);

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

      <View className="flex-row w-full mt-2">
        <View className="w-[140px]">
          <FlatList
            data={filterOptions}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setChoosedFilterType(item.key);
                }}
                className={`w-[110px] h-20 mb-2 rounded-2xl items-center justify-center ${choosedFilterType === item.key ? "bg-green-500" : "bg-white border border-green-900"}`}>
                <Text
                  className={`text-md font-[poppins-bold] ${choosedFilterType === item.key ? "text-white" : "text-green-900 "}`}>
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
        <View className="w-full h-full">
          <View>
            <Text className="text-lg font-[poppins]">Price</Text>
          </View>
          <FlatList
            data={allFilter[choosedFilterType] || []}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={() => {
              return (
                <View className="w-full justify-center">
                  <Text className="text-md font-[poppins]">
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
                  text={item.categoryName}
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
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FilterScreen;
