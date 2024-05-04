import { Stack } from "expo-router";
import React from "react";
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

function FilterScreen() {
  const [choosedFilter, setChoosedFilter] = React.useState(0);

  const filterOptions = React.useMemo(
    () => [
      {
        label: "Category",
        options: [
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 2",
          "Category10",
          "Category 2",
          "Category1",
          "Category 2",
          "Category1",
          "Category 1",
          "Category1",
          "Category 2",
        ],
      },
      {
        label: "Color",
        options: ["Color 1", "Color 2"],
      },
      {
        label: "Size",
        options: ["Size 1", "Size 2"],
      },
      {
        label: "Price",
      },
    ],
    []
  );

  return (
    <SafeAreaView className="px-3 bg-white min-h-screen">
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerShown: true,
          headerShadowVisible: true,
          headerTitle: "Select Filter",
        }}
      />
      <View className="flex-row w-full mt-6">
        <View className="w-[140px]">
          <FlatList
            data={filterOptions}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <Pressable className="w-[110px] h-11 mb-2 rounded-2xl items-center justify-center bg-[#BB0101]">
                <Text className="text-gray-700 text-white font-bold">
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
        <View className="w-full">
          <Text className="font-bold text-xl mb-5">
            {filterOptions[choosedFilter].label}
          </Text>
          <FlatList
            data={filterOptions[choosedFilter].options}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View>
                <BouncyCheckbox
                  className="mb-3"
                  size={25}
                  fillColor="red"
                  unFillColor="#FFFFFF"
                  text={item}
                  // textStyle={{ fontWeight: "bold", color: "black" }}
                  iconStyle={{ borderColor: "red" }}
                  innerIconStyle={{ borderWidth: 2 }}
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
