import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Tab() {
  return (
    <View
      className="h-[100%]"
      style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Tab [HOME]</Text>
    </View>
  );
}
