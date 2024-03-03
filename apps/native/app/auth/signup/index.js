import { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";

import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

export default function Page() {
  const [formData, setFormData] = useState({
    name: { value: null, isTouched: null, isError: null },
    email: { value: null, isTouched: null, isError: null },
    mobileNo: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignup = () => {
    console.log(formData);
  };

  return (
    <ScrollView
      className="p-[15px] h-[100%] pt-[5%]"
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <View className="w-[100%] flex flex-col items-center gap-3">
        <Image
          className="w-[150px] h-[150px]"
          source={require("../../../assets/illustrations/shopp_man.gif")}
        />
        <Text className="text-[30px] font-[mrt-mid]">Get Started</Text>
        <Text className="text-[18px] font-[mrt-light]">
          by creating a free account.
        </Text>
      </View>
      <View className="w-[100%] flex flex-col gap-[5.5%] items-center mt-4">
        <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
          <TextInput
            className="h-[100%] w-[100%] inline-block rounded-lg font-[mrt-mid] placeholder:text-[16px]"
            editable={true}
            multiline={false}
            inputMode="text"
            placeholder="Full name"
            onChangeText={(text) => {
              setFormData((prev) => ({
                ...prev,
                name: {
                  ...prev["name"],
                  value: text,
                  isTouched: true,
                  isError: null,
                },
              }));
            }}
            value={formData.name.value}
          />
          <Feather name="user" size={27} color="#A9A8A8" />
        </View>
        <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
          <TextInput
            className="h-[100%] w-[100%] inline-block rounded-lg font-[mrt-mid] placeholder:text-[16px]"
            editable={true}
            multiline={false}
            inputMode="numeric"
            placeholder="Enter your mobile no"
            onChangeText={(text) => {
              setFormData((prev) => ({
                ...prev,
                mobileNo: {
                  ...prev["mobileNo"],
                  value: text,
                  isTouched: true,
                  isError: null,
                },
              }));
            }}
            value={formData.mobileNo.value}
          />
          <Foundation name="telephone" size={29} color="#A9A8A8" />
        </View>
        <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
          <TextInput
            className="h-[100%] w-[100%] inline-block rounded-lg font-[mrt-mid] placeholder:text-[16px]"
            editable={true}
            multiline={false}
            inputMode="email"
            placeholder="Enter email"
            onChangeText={(text) => {
              setFormData((prev) => ({
                ...prev,
                email: {
                  ...prev["email"],
                  value: text,
                  isTouched: true,
                  isError: null,
                },
              }));
            }}
            value={formData.email.value}
          />
          <Fontisto name="email" size={26} color="#A9A8A8" />
        </View>
        <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
          <TextInput
            className="h-[100%] w-[100%] rounded-lg font-[mrt-mid] placeholder:text-[16px]"
            editable={true}
            multiline={false}
            inputMode="text"
            secureTextEntry={!isPasswordVisible}
            placeholder="Password"
            onChangeText={(text) => {
              setFormData((prev) => ({
                ...prev,
                password: {
                  ...prev["password"],
                  value: text,
                  isTouched: true,
                  isError: null,
                },
              }));
            }}
            value={formData.password.value}
          />
          {/* <Feather name="lock" size={25} color="#A9A8A8" /> */}
          {isPasswordVisible ? (
            <TouchableOpacity
              onPress={() => {
                setIsPasswordVisible((prev) => !prev);
              }}>
              <FontAwesome5 name="eye" size={24} color="#A9A8A8" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsPasswordVisible((prev) => !prev);
              }}>
              <FontAwesome5 name="eye-slash" size={24} color="#A9A8A8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="w-[100%] flex flex-col gap-5 items-center mt-[4%]">
        <TouchableOpacity
          className="flex justify-center items-center h-[60px] w-[100%] bg-[#6C63FF] border-none outline-none rounded-lg"
          onPress={handleSignup}>
          <Text className="text-[20px] text-white font-[mrt-bold]">
            Create account
          </Text>
        </TouchableOpacity>
        <Link
          push
          className="underline text-center font-[mrt-bold] text-[15px]"
          href={"/auth/login"}>
          Login Now
        </Link>
        <Text className="text-center font-[mrt-mid]">
          By continueing you are agreeing to our{" "}
          <Link push className="underline text-[#6C63FF]" href={"/terms"}>
            Terms & Conditions
          </Link>
        </Text>
      </View>
      <View className="min-h-[100px]"></View>
    </ScrollView>
  );
}
