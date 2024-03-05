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

export default function Page() {
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
    <SafeAreaView>
      <ScrollView
        className="p-[15px] h-[100%] pt-[5%]"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View className="w-[100%] flex flex-col items-center gap-y-3">
          <Image
            className="w-[200px] h-[200px]"
            source={require("../../../assets/illustrations/shopp_man.gif")}
          />
          <Text className="text-[30px] font-[mrt-mid]">Welcome back</Text>
          <Text className="text-[18px] font-[mrt-light]">
            sign in to access your account
          </Text>
        </View>
        <View className="w-[100%] flex flex-col gap-y-[5.5%] items-center mt-4">
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
                    isError: !isValidIndianMobileNumber(text),
                  },
                }));
              }}
              value={formData.mobileNo.value}
            />
            <Foundation name="telephone" size={29} color="#A9A8A8" />
          </View>

          {formData.mobileNo.isError ? (
            <Text className="self-start text-[14px] font-[mrt-bold] text-[#EA1E24]">
              * Not a valid indian mobile number
            </Text>
          ) : (
            formData.password.isTouched && (
              <Text className="self-start text-[14px] font-[mrt]">✔️</Text>
            )
          )}

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
            <Text className="self-start text-[14px] font-[mrt-bold] text-[#EA1E24]">
              * Password should be of atleast 8 digits and should contain one
              uppercase letter, and one special character.
            </Text>
          ) : (
            formData.password.isTouched && (
              <Text className="self-start text-[14px] font-[mrt]">✔️</Text>
            )
          )}

          <Link
            push
            href="/resetpass"
            className="text-[15px] text-[#6C63FF] self-end underline underline-offset-[5px] font-[mrt-mid]">
            Forgot password?
          </Link>
        </View>
        <View className="w-[100%] flex flex-col gap-y-7 items-center mt-[-1px]">
          <TouchableOpacity
            disabled={isSubmitDisabled}
            className={`flex justify-center items-center h-[60px] w-[100%] ${isSubmitDisabled ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg disabled:bg-[rgba(40,40,41,0.8)]`}
            onPress={handleLogin}>
            <Text className="text-[20px] text-white font-[mrt-bold]">
              Login
            </Text>
          </TouchableOpacity>
          <Text className="text-center font-[mrt-mid] text-[16px]">
            New here?{" "}
            <Link
              push
              className="underline font-[mrt-bold]"
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
