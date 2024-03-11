import { useEffect, useState } from "react";
import {
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
} from "validator";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleSignup = () => {
    try {
      // TODO : send fetch request to

      const extractedData = Object.keys(formData).reduce(
        (newFormData, keyName) => {
          return { ...newFormData, [keyName]: formData[keyName].value };
        },
        { name: "", email: "", mobileNo: "", password: "" }
      ); // postable form data

      router.push({
        pathname: "/auth/verify_otp",
        // params: extractedData,
      });
    } catch (error) {
      console.log(error);
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View className="w-[100%] flex flex-col items-center gap-y-3">
          <Image
            // className="w-[150px] h-[150px]"
            className="w-[90px] h-[90px]"
            source={require("../../../assets/illustrations/shopp_man.gif")}
          />
          <Text className="text-[30px] font-[mrt-mid]">Get Started</Text>
          <Text className="text-[18px] font-[mrt-light]">
            by creating a free account.
          </Text>
        </View>
        <View className="w-[100%] flex flex-col gap-y-[5.5%] items-center mt-4">
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
                    isError: !hasOneSpaceBetweenNames(text),
                  },
                }));
              }}
              value={formData.name.value}
            />
            <Feather name="user" size={27} color="#A9A8A8" />
          </View>

          {formData.name.isError ? (
            <Text className="self-start text-[14px] font-[mrt-bold] text-[#EA1E24]">
              * Enter your full name
            </Text>
          ) : (
            formData.name.isTouched && (
              <Text className="self-start text-[14px] font-[mrt]">✔️</Text>
            )
          )}

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
              * Not a valid mobile number
            </Text>
          ) : (
            formData.mobileNo.isTouched && (
              <Text className="self-start text-[14px] font-[mrt]">✔️</Text>
            )
          )}

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
                    isError: !isValidEmail(text),
                  },
                }));
              }}
              value={formData.email.value}
            />
            <Fontisto name="email" size={26} color="#A9A8A8" />
          </View>

          {formData.email.isError ? (
            <Text className="self-start text-[14px] font-[mrt-bold] text-[#EA1E24]">
              * Not a valid email address
            </Text>
          ) : (
            formData.email.isTouched && (
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
            <Text className="self-start text-[14px] font-[mrt-bold] text-[#EA1E24]">
              * Password should be of atleast 8 digits and should contain one
              uppercase letter, and one special character.
            </Text>
          ) : (
            formData.password.isTouched && (
              <Text className="self-start text-[14px] font-[mrt]">✔️</Text>
            )
          )}

          <View className="h-[60px] w-[100%] pr-[6%] border-none outline-none flex flex-row justify-start items-center">
            <Text className="text-[13px] text-left font-[mrt-mid] leading-[23px]">
              Gender
            </Text>
            {/* <RadioGroup
              inital={0}
              layout="row"
              radioButtons={[
                {
                  id: 0,
                  outerStyle: {
                    width: 50,
                    height: 50,
                    borderColor: "black",
                    borderRadius: 25,
                  },
                  innerStyle: {
                    borderRadius: 25,
                  },
                  text: "Rainbow",
                  value: "MALE",
                },
                {
                  id: 1,
                  outerStyle: {
                    width: 50,
                    height: 50,
                    borderColor: "#FB4009",
                    borderRadius: 25,
                  },
                  innerStyle: {
                    borderRadius: 25,
                  },
                  text: "Rainbow",
                  value: "FEMALE",
                },
                {
                  id: 2,
                  outerStyle: {
                    width: 50,
                    height: 50,
                    borderColor: "#F6800F",
                    borderRadius: 25,
                  },
                  innerStyle: {
                    borderRadius: 25,
                  },
                  text: "Rainbow",
                  value: "RAINBOW",
                },
              ]}
              onPress={(item) => {
                console.log(item);
                setSelectedId(item);
              }}
              containerStyle={{
                marginRight: 10,
                marginTop: 10,
                padding: 0,
                width: 25,
                height: 25,
              }}
            /> */}
          </View>

          <View className="h-[60px] w-[100%] pr-[6%] border-none outline-none flex flex-row justify-start items-center">
            <BouncyCheckbox
              size={25}
              fillColor="#6C63FF"
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
            <Text className="text-[13px] text-left font-[mrt-mid] leading-[23px]">
              By continuing you are agree to our{" "}
              <Link
                push
                className="underline text-[#6C63FF] font-[mrt-bold]"
                href={"/terms-&-conditions"}>
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                push
                className="underline text-[#6C63FF] font-[mrt-bold]"
                href={"/privacy-policy"}>
                Privacy Policy
              </Link>
            </Text>
          </View>
        </View>

        <View className="w-[100%] flex flex-col gap-y-6 items-center mt-[-1px]">
          <TouchableOpacity
            disabled={isSubmitDisabled}
            className={`flex justify-center items-center h-[60px] w-[100%] ${isSubmitDisabled ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg`}
            onPress={handleSignup}>
            <Text className="text-[20px] text-white font-[mrt-bold]">
              Create account
            </Text>
          </TouchableOpacity>
          <Text className="text-center font-[mrt-mid] text-[16px]">
            Already have an account?{" "}
            <Link
              replace
              className="underline text-center font-[mrt-bold]"
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
