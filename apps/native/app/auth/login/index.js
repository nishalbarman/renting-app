import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Stack, useRouter } from "expo-router";

import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

import {
  isValidIndianMobileNumber,
  isValidPassword,
} from "custom-validator-renting";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserAuthData } from "@store/rtk";

export default function Page() {
  const [formData, setFormData] = useState({
    mobileNo: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    try {
      setIsPending(true);
      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { mobileNo: "", password: "" }
      ); // postable form data

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        extractedData
      );

      dispatch(setUserAuthData({ ...response.data.user }));

      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

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
      <Stack.Screen
        options={{
          headerShown: false,
          title: "",
          headerStyle: {
            backgroundColor: "green",
            margin: 0,
            padding: 0,
          },
        }}
      />
      <ScrollView
        className="bg-white"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          width: "100%",
        }}>
        {/* <View className="w-full items-center bg-green-600 py-12">
          <Text className="text-[30px] font-[poppins-bold] tracking-widest text-white">
            Savero
          </Text>
        </View> */}
        <Image
          source={require("../../../assets/appIcons/app_launcher.webp")}
          className="w-20 h-20 rounded-full"
        />
        <View className="w-full flex flex-col items-center px-4">
          <View className="w-full flex-col items-center py-6 z-[999]">
            <Text className="text-[30px] font-[poppins-mid] mb-2">
              Welcome back
            </Text>
            <Text className="text-[18px] font-[poppins-light]">
              sign in to access your account
            </Text>
          </View>

          <View className="h-[60px] w-full p-[0px_6%] border-none outline-none bg-white bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg mb-3">
            <TextInput
              className="h-full w-full inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
              * Not a valid indian mobile number
            </Text>
          ) : (
            <>
              {/* formData.password.isTouched && (
              <Text className="self-start text-[14px] font-[poppins]">✔️</Text>) */}
            </>
          )}

          <View className="h-[60px] w-full p-[0px_6%] border-none outline-none bg-white bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg mb-3">
            <TextInput
              className="h-full w-full rounded-lg font-[poppins-mid] placeholder:text-[16px]"
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
            <>
              {/* ( formData.password.isTouched && (
              <Text className="self-start text-[14px] font-[poppins]">✔️</Text>)
              ) */}
            </>
          )}

          <Link
            push
            href="/resetpass"
            className="text-[15px] text-green-800 self-end underline underline-offset-[5px] font-[poppins-mid]">
            Forgot password?
          </Link>
        </View>
        <View className="w-full flex flex-col gap-y-7 items-center mt-[-1px]">
          <TouchableOpacity
            disabled={isSubmitDisabled || isPending}
            className={`flex justify-center items-center h-12 w-[90%] ${isSubmitDisabled ? "bg-green-300" : "bg-green-600"} rounded-lg`}
            onPress={handleLogin}>
            {isPending ? (
              <ActivityIndicator size={30} color={"white"} />
            ) : (
              <Text className="text-lg text-white font-[poppins-mid]">
                Login
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-center font-[poppins-mid] text-[16px]">
            New here?{" "}
            <Link
              replace
              className="underline font-[poppins-bold]"
              href={"/auth/signup"}>
              Create an account
            </Link>
          </Text>
        </View>
        <View className="min-h-[100px]"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
