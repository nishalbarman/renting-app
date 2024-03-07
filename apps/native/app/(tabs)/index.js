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
import ProductsList from "../../components/ProductsList/ProductsList";

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
        showsVerticalScrollIndicator={false}
        ounces={false} // Set this to false to disable overscroll effect
        className="p-[5px] h-[100%] pt-[5%]"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 10,
          flexGrow: 1,
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
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzJVW44RYdtl5oVB548Hqz8Iqw9GIiZoYyQXUcm-qw6ttb_YDGLT_3jxYX4unE-TEZLFA&usqp=CAU"
            }
            categoryName={"Watches"}
          />
          <CategoryItem
            categoryImage={
              "https://shop.tvsmotor.com/cdn/shop/products/NF600520_1.png?v=1691651575"
            }
            categoryName={"Gloves"}
          />
        </View>
        <View className="flex-1 w-[100%]">
          <ProductsList
            title="🔥 New Arrivals"
            viewAllPath="/new-arrivals"
            bgColor="#faf0ff"
            titleColor="black"
          />
          <ProductsList
            title="✌️ Rent Products"
            viewAllPath="/rent"
            bgColor="#fff9f2"
            titleColor="black"
          />

          <ProductsList
            title="😍 Sale Products"
            viewAllPath="/buy"
            bgColor="#f5fffd"
            titleColor="black"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
