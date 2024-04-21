import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

import { useRouter } from "expo-router";

import { useDispatch } from "react-redux";

import RadioGroup from "react-native-radio-buttons-group";
import { setSort } from "@store/rtk";

export default function ProductSort() {
  const handlers = useScrollHandlers();

  // const { name, mobileNo } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedSortMethod, setSelectedSortMethod] = useState(0);

  useEffect(() => {
    SheetManager.show("product-sort-sheet");
  }, []);

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-center pb-10">
            <Text className="font-[poppins-bold] text-[14px]">SORT BY</Text>

            <View className="w-full px-4">
              <RadioGroup
                radioButtons={[
                  { id: 0, label: "None", value: "na" },
                  { label: "Popularity", value: "popularity" },
                  {
                    id: 1,
                    label: "Price -- Low to High",
                    value: "low-to-hight-price",
                  },
                  {
                    id: 2,
                    label: "Price -- High to Low",
                    value: "hight-to-low-price",
                  },
                  { id: 3, label: "Newest First", value: "newest" },
                ]}
                onPress={setSelectedSortMethod}
                selectedId={selectedSortMethod}
              />
            </View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
