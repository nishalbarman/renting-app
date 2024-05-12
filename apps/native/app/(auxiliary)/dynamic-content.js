import axios from "axios";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useSelector } from "react-redux";
import handleGlobalError from "../../lib/handleError";
import RenderHTML from "react-native-render-html";

const DynamicContent = () => {
  const params = useLocalSearchParams();

  const jwtToken = useSelector((state) => state.auth.jwtToken);

  const [isLoading, setIsLoading] = useState(true);
  const [dynamicContent, setDynamicContent] = useState(null);

  const fetchDynamicContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/dynamic/content/${params.contentLink}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const content = response.data;

      setDynamicContent(content);
    } catch (error) {
      console.log("dynamic-content -->");
      handleGlobalError(error);
    } finally {
      setIsLoading(false);
    }
  }, [params.contentLink]);

  useEffect(() => {
    fetchDynamicContent();
  }, []);

  const router = useRouter();

  return (
    <SafeAreaView className={"bg-white min-h-full"}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerShown: true,
          title: "Status",
          headerTitleAlign: "center",
        }}
      />
      {isLoading ? (
        <View className="h-full w-full flex items-center justify-center">
          <ActivityIndicator size={45} color={"green"} />
        </View>
      ) : (
        <View className="mt-2 pt-4 pb-6 bg-white rounded-md p-3">
          <Text className="text-lg font-[poppins-xbold]">
            {dynamicContent.title}
          </Text>
          <RenderHTML
            systemFonts={["poppins", "poppins-mid", "poppins-bold"]}
            // contentWidth={width}
            source={{
              html:
                `<html style="font-size: 13px">${dynamicContent.content}</html>` ||
                "<p>No description</p>",
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default DynamicContent;
