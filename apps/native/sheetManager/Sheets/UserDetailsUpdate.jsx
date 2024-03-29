import React, { useEffect, useState } from "react";
import {
  AntDesign,
  Entypo,
  Feather,
  Fontisto,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  hasOneSpaceBetweenNames,
  isValidEmail,
  isValidPassword,
} from "validator";
import ReLogin from "../../modal/Cart/ReLogin-Modal";

export default function Widget() {
  const handlers = useScrollHandlers();

  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: { value: auth.name, isTouched: true, isError: null },
    email: { value: auth.email, isTouched: true, isError: null },
    password: { value: undefined, isTouched: true, isError: undefined },
  });

  // const [formData, setFormData] = useState({
  //   name: { value: "Nishal Barman", isTouched: true, isError: null },
  //   // email: { value: "nishalbarman@gmail.com", isTouched: true, isError: null },
  //   // mobileNo: { value: "9101114906", isTouched: true, isError: null },
  //   password: { value: "@NishalBoss21", isTouched: true, isError: null },
  // });

  const [modalVisible, setModalVisible] = useState(false);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isUpdatationPending, setIsUpdationPending] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      setIsUpdationPending(true);
      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { name: "", email: "", mobileNo: "", password: "" }
      ); // postable form data

      const response = await axios.patch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/update`,
        extractedData,
        {
          headers: {
            authorization: `Bearer ${auth.jwtToken}`,
          },
        }
      );

      setModalVisible(true);
    } catch (error) {
      console.error("User Profile Update ==>", error);
      console.error("User Profile Update ==>", error?.response);
    } finally {
      setIsUpdationPending(false);
    }
  };

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.password.isTouched ||
        formData.password.isError ||
        !formData.name.isTouched ||
        formData.name.isError ||
        !formData.email.isTouched ||
        formData.email.isError
    );
  }, [formData]);

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView
          className="p-4 w-full"
          {...handlers}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text className="font-bold text-[18px] text-center">
            Update Your Profile
          </Text>

          <View className="w-[100%] flex flex-col gap-y-[13px] items-center mt-1">
            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
                      isError: !hasOneSpaceBetweenNames(text),
                    },
                  }));
                }}
                value={formData.name.value}
              />
              <Feather name="user" size={27} color="#A9A8A8" />
            </View>

            {formData.name.isError ? (
              <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                * Enter your full name
              </Text>
            ) : (
              formData.name.isTouched && (
                <>
                  {/* <Text className="self-start text-[14px] font-[poppins]">✔️</Text> */}
                </>
              )
            )}

            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
                editable={false}
                multiline={false}
                inputMode="numeric"
                placeholder="Enter your mobile no"
                value={auth.mobileNo}
              />
              <Foundation name="telephone" size={29} color="#A9A8A8" />
            </View>

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
                * Password should be of atleast 8 digits and should contain one
                uppercase letter, and one special character.
              </Text>
            ) : (
              formData.password.isTouched && (
                <>
                  {/* <Text className="self-start text-[14px] font-[poppins]">✔️</Text> */}
                </>
              )
            )}
          </View>

          <TouchableOpacity
            disabled={isSubmitDisabled || isUpdatationPending}
            className={`flex justify-center items-center h-12 w-[90%] ${isSubmitDisabled ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg mt-5`}
            onPress={handleProfileUpdate}>
            {isUpdatationPending ? (
              <ActivityIndicator size={30} color={"white"} />
            ) : (
              <Text className="text-[18px] text-white font-[poppins]">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
          <View className="min-h-[30px]"></View>
        </ScrollView>
      </NativeViewGestureHandler>
      <ReLogin modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ActionSheet>
  );
}
