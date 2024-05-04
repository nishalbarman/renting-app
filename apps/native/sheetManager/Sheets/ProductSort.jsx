import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

import { useRouter } from "expo-router";

import { useDispatch, useSelector } from "react-redux";

import RadioGroup from "react-native-radio-buttons-group";
import { setSort } from "@store/rtk";

export default function ProductSort() {
  const handlers = useScrollHandlers();

  const radiogroupContents = useMemo(
    () => [
      {
        id: 0,
        label: <Text className="font-bold">None</Text>,
        value: "",
        containerStyle: radiobuttonStyle,
      },
      {
        id: 1,
        label: <Text className="font-bold">Popularity</Text>,
        value: "popularity",
        containerStyle: radiobuttonStyle,
      },
      {
        id: 2,
        label: <Text className="font-bold">Price -- Low to High</Text>,
        value: "low-to-hight-price",
        containerStyle: radiobuttonStyle,
      },
      {
        id: 3,
        label: <Text className="font-bold">Price -- High to Low</Text>,
        value: "hight-to-low-price",
        containerStyle: radiobuttonStyle,
      },
      {
        id: 4,
        label: <Text className="font-bold">Newest First</Text>,
        value: "newest",
        containerStyle: radiobuttonStyle,
      },
    ],
    []
  );

  const dispatch = useDispatch();

  // const [selectedSortMethod, setSelectedSortMethod] = useState(0);
  const { id: selectedSortMethod } = useSelector(
    (state) => state.sort_filter_products.sort
  );

  const handleSetSelectedSortMethod = (id, other) => {
    console.log(id, other);
    dispatch(setSort({ id: id, value: radiogroupContents[id].value }));
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-center pb-10">
            <Text className="font-[poppins-bold] text-[14px]">SORT BY</Text>

            <View className="w-full px-4">
              <RadioGroup
                containerStyle={radiogroupStyle}
                radioButtons={radiogroupContents}
                onPress={handleSetSelectedSortMethod}
                selectedId={selectedSortMethod}
              />
            </View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}

const radiogroupStyle = StyleSheet.create({
  flex: 1,
  flexDirection: "column",
  alignContents: "between",
  justifyContents: "between",
  width: "100%",
});

const radiobuttonStyle = StyleSheet.create({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});
