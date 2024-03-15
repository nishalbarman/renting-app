import {
  AntDesign,
  Feather,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

import { NativeViewGestureHandler } from "react-native-gesture-handler";
import {
  isValidEmail,
  isValidIndianMobileNumber,
  isValidPassword,
} from "validator";

export default function AddAddress() {
  const handlers = useScrollHandlers();

  const [formData, setFormData] = useState({
    name: { value: "Nishal Barman", isTouched: true, isError: null },
    email: { value: "nishalbarman@gmail.com", isTouched: true, isError: null },
    mobileNo: { value: "9101114906", isTouched: true, isError: null },
    isAgreementChecked: { value: true, isTouched: true, isError: null },
    password: { value: "@NishalBoss21", isTouched: true, isError: null },
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignup = async () => {
    try {
      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { name: "", email: "", mobileNo: "", password: "" }
      ); // postable form data

      const response = await axios.post(
        `http://192.168.79.210:8000/auth/sendOtp`,
        extractedData
      );
    } catch (error) {
      console.error("signup->index.js ==>", error);
      console.error("signup->index.js ==>", error?.response);
    }
  };

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.mobileNo.isTouched ||
        formData.mobileNo.isError ||
        !formData.password.isTouched ||
        formData.password.isError ||
        !formData.name.isTouched ||
        formData.name.isError ||
        !formData.email.isTouched ||
        formData.email.isError ||
        !formData.isAgreementChecked.isTouched
    );
  }, [formData]);

  const handleChooseLocationOnMap = () => [
    SheetManager.show("location-select-map"),
  ];

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-start gap-y-2 pb-10 p-3">
            <Text className="font-[poppins-xbold] text-[18px]">
              Choose your location
            </Text>
            <Text className="font-[poppins] text-[15px] text-gray">
              Choose your location to get started adding your address
            </Text>

            <View className="w-[100%] flex flex-col gap-y-[13px] items-center mt-1">
              <TouchableOpacity
                onPress={handleChooseLocationOnMap}
                className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
                <View className="flex flex-row">
                  <Ionicons name="location-outline" size={24} color="gray" />
                  <Text
                    // multiline={true}
                    numberOfLines={3}
                    className="ml-1 h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px] text-gray"
                    value={formData.mobileNo.value}>
                    Choose your location
                  </Text>
                </View>
                <FontAwesome6
                  name="location-crosshairs"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>

              <View className="bg-[#D1D3D7] w-[100%] h-[1px] mb-2"></View>

              <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
                <TextInput
                  className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
                        isError: !isValidIndianMobileNumber(text),
                      },
                    }));
                  }}
                  value={formData.mobileNo.value}
                />
                <Foundation name="telephone" size={29} color="#A9A8A8" />
              </View>

              {formData.mobileNo.isError ? (
                <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                  * Not a valid mobile number
                </Text>
              ) : (
                formData.mobileNo.isTouched && (
                  <>
                    {/* <Text className="self-start text-[14px] font-[poppins]">✔️</Text> */}
                  </>
                )
              )}

              <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
                <TextInput
                  className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
                        isError: !isValidEmail(text),
                      },
                    }));
                  }}
                  value={formData.email.value}
                />
                <Fontisto name="email" size={26} color="#A9A8A8" />
              </View>

              {formData.email.isError ? (
                <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                  * Not a valid email address
                </Text>
              ) : (
                formData.email.isTouched && (
                  <>
                    {/* <Text className="self-start text-[14px] font-[poppins]">✔️</Text> */}
                  </>
                )
              )}

              <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
                <TextInput
                  className="h-[100%] w-[100%] rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
                        isError: !isValidPassword(text),
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

              {formData.password.isError ? (
                <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                  * Password should be of atleast 8 digits and should contain
                  one uppercase letter, and one special character.
                </Text>
              ) : (
                formData.password.isTouched && (
                  <>
                    {/* <Text className="self-start text-[14px] font-[poppins]">✔️</Text> */}
                  </>
                )
              )}
            </View>

            <View className="w-[100%] flex flex-col gap-y-6 items-center mt-[-1px]">
              <TouchableOpacity
                disabled={isSubmitDisabled}
                className={`flex justify-center items-center h-[55px] w-[90%] ${isSubmitDisabled ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg`}
                onPress={handleSignup}>
                <Text className="text-[20px] text-white font-[poppins-bold]">
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
            <View className="min-h-[100px]"></View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
