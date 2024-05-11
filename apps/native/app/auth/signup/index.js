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
import { Link, useRouter } from "expo-router";

import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import {
  hasOneSpaceBetweenNames,
  isValidIndianMobileNumber,
  isValidEmail,
  isValidPassword,
} from "custom-validator-renting";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";

export default function Page() {
  // const [formData, setFormData] = useState({
  //   name: { value: null, isTouched: null, isError: null },
  //   email: { value: null, isTouched: null, isError: null },
  //   mobileNo: { value: null, isTouched: null, isError: null },
  //   isAgreementChecked: { value: null, isTouched: null, isError: null },
  //   password: { value: null, isTouched: null, isError: null },
  // });

  const [formData, setFormData] = useState({
    name: { value: "Nishal Barman", isTouched: true, isError: null },
    email: { value: "nishalbarman@gmail.com", isTouched: true, isError: null },
    mobileNo: { value: "9101114906", isTouched: true, isError: null },
    isAgreementChecked: { value: true, isTouched: true, isError: null },
    password: { value: "@NishalBoss21", isTouched: true, isError: null },
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const handleSignup = async () => {
    try {
      setIsPending(true);
      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { name: "", email: "", mobileNo: "", password: "" }
      ); // postable form data

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/sendOtp`,
        extractedData
      );

      router.push({
        pathname: "/auth/verify_otp",
        params: extractedData,
      });
    } catch (error) {
      console.error("signup->index.js ==>", error);
      console.error("signup->index.js ==>", error?.response);
    } finally {
      setIsPending(false);
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

  return (
    <SafeAreaView className="bg-white">
      <ScrollView
        className="p-[15px] h-[100%] pt-[5%]"
        contentContainerStyle={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
        }}>
        <View className="w-[100%] flex flex-col items-center gap-y-3">
          {/* <Image
            // className="w-[150px] h-[150px]"
            className="w-[90px] h-[90px]"
            source={require("../../../assets/illustrations/shopp_man.gif")}
          /> */}
          <Text className="text-[30px] font-[poppins-mid]">Get Started</Text>
          <Text className="text-[18px] font-[poppins-light]">
            by creating a free account.
          </Text>
        </View>
        <View className="w-[100%] flex flex-col gap-y-[13px] items-center mt-4">
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

          <View className="h-[60px] w-[100%] pr-[6%] border-none outline-none flex flex-row justify-start items-center">
            <BouncyCheckbox
              size={25}
              fillColor="green"
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "red" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ fontFamily: "mrt" }}
              onPress={(isChecked) => {
                setFormData((prev) => ({
                  ...prev,
                  isAgreementChecked: {
                    ...prev["isAgreementChecked"],
                    value: isChecked,
                    isTouched: isChecked,
                    isError: null,
                  },
                }));
              }}
            />
            <Text className="text-[13px] text-left font-[poppins-mid] leading-[23px]">
              By continuing you are agree to our{" "}
              <Link
                push
                className="underline text-green-800 font-[poppins-bold]"
                href={"/terms-&-conditions"}>
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                push
                className="underline text-green-800 font-[poppins-bold]"
                href={"/privacy-policy"}>
                Privacy Policy
              </Link>
            </Text>
          </View>
        </View>

        <View className="w-[100%] flex flex-col gap-y-6 items-center mt-[-1px]">
          <TouchableOpacity
            disabled={isSubmitDisabled || isPending}
            className={`flex justify-center items-center h-12 w-[90%] ${isSubmitDisabled ? "bg-green-300" : "bg-green-600"} border-none outline-none rounded-lg`}
            onPress={handleSignup}>
            {isPending ? (
              <ActivityIndicator size={30} color={"white"} />
            ) : (
              <Text className="text-lg text-white font-[poppins-mid]">
                Create account
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-center font-[poppins-mid] text-[16px]">
            Already have an account?{" "}
            <Link
              replace
              className="underline text-center font-[poppins-bold]"
              href={"/auth/login"}>
              Login Now
            </Link>
          </Text>
        </View>
        <View className="min-h-[100px]"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
