import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function Tab() {
  return (
    <ScrollView
      className="p-[15px] h-[100%] pt-[10%] w-[100%]"
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        rowGap: "40px",
      }}>
      <Text>Hi, I am on Dashboard</Text>
    </ScrollView>
  );
}
