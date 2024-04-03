import React from "react";
import { View, Text } from "react-native";

function ListFilter({ icon, iconPostion, title, style }) {
  return (
    <View
      style={!!style ? style : {}}
      className={
        "flex-row gap-x-2 h-[40px] ml-1 flex items-center justify-center w-fit px-3 py-2 rounded-2xl border border-gray-300 bg-white"
      }>
      {iconPostion === "left" && icon()}
      <Text className=" text-black">{title}</Text>
      {iconPostion === "right" && icon()}
    </View>
  );
}

export default ListFilter;
