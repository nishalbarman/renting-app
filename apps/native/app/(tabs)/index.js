import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";

import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

import { isValidIndianMobileNumber, isValidPassword } from "validator";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryItem from "../../components/Category/CategoryItem";

export default function Tab() {
  const [formData, setFormData] = useState({
    mobileNo: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {};

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.mobileNo.isTouched ||
        formData.mobileNo.isError ||
        !formData.password.isTouched ||
        formData.password.isError
    );
  }, [formData]);
  return (
    <SafeAreaView className="bg-white">
      <ScrollView
        className="p-[15px] h-[100%] pt-[5%]"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View className="flex flex-row gap-x-2 w-[100%]">
          <CategoryItem
            categoryImage={
              "https://clipart-library.com/images_k/shoe-transparent-background/shoe-transparent-background-19.jpg"
            }
            categoryName={"Sneakers"}
          />
          <CategoryItem
            categoryImage={
              "https://p7.hiclipart.com/preview/226/888/857/smartwatch-apple-watch-wearable-technology-watch.jpg"
            }
            categoryName={"Watches"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
