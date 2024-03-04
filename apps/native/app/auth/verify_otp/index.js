import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function Page() {
  const mobileNo = "_blank_ hai bhaiya";
  const searchParams = useLocalSearchParams();

  const [otp, setOtp] = useState([-1, -1, -1, -1]);
  const [otpFieldIndex, setOtpFieldIndex] = useState(0);

  const otpFirstFieldRef = useRef(null);
  const otpSecondFieldRef = useRef(null);
  const otpThirdFieldRef = useRef(null);
  const otpFourthFieldRef = useRef(null);

  const otpBoxesRefs = [
    otpFirstFieldRef,
    otpSecondFieldRef,
    otpThirdFieldRef,
    otpFourthFieldRef,
  ];

  const handleOTPkeyPress = ({ nativeEvent: { key } }) => {
    console.log("What does key have -->", key);

    if (key === "Enter") {
      return;
    }

    setOtp((prevOtp) => {
      if (key === "Backspace") {
        const newOTPArray = [...prevOtp];

        if (!!!newOTPArray[otpFieldIndex]) {
          console.log("Current OTPBox Index -->", otpFieldIndex);

          otpBoxesRefs[
            otpFieldIndex - 1 < 0 ? 0 : otpFieldIndex - 1
          ]?.current?.focus();
        }

        newOTPArray[otpFieldIndex] = "";

        setOtpFieldIndex((prevOTPField) =>
          prevOTPField <= 0 ? 0 : prevOTPField - 1
        );

        return newOTPArray;
      }

      const newOTPArray = [...prevOtp];
      newOTPArray[otpFieldIndex] = parseInt(key);

      otpBoxesRefs[otpFieldIndex + 1]?.current?.focus();

      setOtpFieldIndex((otpFieldIndex) =>
        otpFieldIndex >= 3 ? 3 : otpFieldIndex + 1
      );

      return newOTPArray;
    });
  };

  console.log(searchParams);

  return (
    <ScrollView
      className="p-[15px] h-[100%] pt-[10%] w-[100%]"
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <View className="flex flex-col gap-y-10 items-center w-[100%]">
        <Text className="self-start w-[100%] text-[28px] font-[mrt-mid]">
          Almost there
        </Text>
        <Text className="font-[mrt-light] text-[18px]">
          Please enter the 6-digit code sent to your mobile no{" "}
          <Text className="font-[mrt-mid]">{mobileNo}</Text> for verification
        </Text>
        <View className="flex flex-row items-center justify-center gap-x-4 w-[100%]">
          <TextInput
            ref={otpFirstFieldRef}
            inputMode="numeric"
            className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[mrt-mid] text-[16px] text-center text-[black]"
            maxLength={1}
            minLength={1}
            onKeyPress={handleOTPkeyPress}
            onFocus={() => {
              setOtpFieldIndex(0);
            }}
          />
          <TextInput
            ref={otpSecondFieldRef}
            inputMode="numeric"
            className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[mrt-mid] text-[16px] text-center text-[black]"
            maxLength={1}
            minLength={1}
            onKeyPress={handleOTPkeyPress}
            onFocus={() => {
              setOtpFieldIndex(1);
            }}
          />
          <TextInput
            ref={otpThirdFieldRef}
            inputMode="numeric"
            className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[mrt-mid] text-[16px] text-center text-[black]"
            maxLength={1}
            minLength={1}
            onKeyPress={handleOTPkeyPress}
            onFocus={() => {
              setOtpFieldIndex(2);
            }}
          />
          <TextInput
            ref={otpFourthFieldRef}
            inputMode="numeric"
            className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[mrt-mid] text-[16px] text-center text-[black]"
            maxLength={1}
            minLength={1}
            onKeyPress={handleOTPkeyPress}
            onFocus={() => {
              setOtpFieldIndex(3);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
