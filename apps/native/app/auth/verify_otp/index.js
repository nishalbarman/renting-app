import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValid4DigitOtp } from "custom-validator-renting";
import { setUserAuthData } from "@store/rtk";
import { useDispatch } from "react-redux";
import handleGlobalError from "../../../lib/handleError";

export default function Page() {
  const searchParams = useLocalSearchParams();

  const name = useMemo(() => {
    return searchParams.name;
  }, []);

  const mobileNo = useMemo(() => {
    return searchParams.mobileNo;
  }, []);

  const [otp, setOtp] = useState(["_", "_", "_", "_"]);
  const [otpFieldIndex, setOtpFieldIndex] = useState(0);
  const [finalOtp, setFinalOtp] = useState(otp.join(""));

  const [isFinalOTPValid, setIsFinalOTPValid] = useState(true);

  const [formSubmitError, setFormSubmitError] = useState({
    isError: false,
    message: "",
  });

  const otpBoxesRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]; // references for input fields

  const [isResendOTPEnabled, setIsResendOTPEnabled] = useState(false);
  const [resendOTPTimeout, setResendOTPTimeout] = useState(30);

  const dispatch = useDispatch();

  const handleResendOTP = async () => {
    try {
      if (isResendOTPEnabled) {
        delete searchParams.otp;
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/sendOtp`,
          searchParams
        );
        setIsResendOTPEnabled(false);
        setOtp(["_", "_", "_", "_"]);
        setOtpFieldIndex(0);
        setFinalOtp("");
        setFormSubmitError({
          isError: false,
          message: "",
        });
        setResendOTPTimeout(30);
        setIsFinalOTPValid(false);
      }
    } catch (error) {
      console.error("Resend OTP error => ", error.response.data.message);
      handleGlobalError(error);
    }
  };

  const handleOTPkeyPress = useCallback(
    ({ nativeEvent: { key } }) => {
      if (key === "Enter") {
        return;
      }

      setOtp((prevOtp) => {
        if (key === "Backspace") {
          const newOTPArray = [...prevOtp];

          if (!newOTPArray[otpFieldIndex]) {
            otpBoxesRefs[
              otpFieldIndex - 1 < 0 ? 0 : otpFieldIndex - 1
            ]?.current?.focus();
            setOtpFieldIndex((prevOTPField) =>
              prevOTPField <= 0 ? 0 : prevOTPField - 1
            );
            return newOTPArray;
          }

          newOTPArray[otpFieldIndex] = "";
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
    },
    [otpFieldIndex]
  );

  const [isPending, setIsPending] = useState(false);

  const handleOTPSubmit = useCallback(async () => {
    try {
      if (!isFinalOTPValid) return;

      setIsPending(true);

      searchParams.otp = finalOtp;

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`,
        searchParams
      );

      const data = response?.data;

      try {
        dispatch(setUserAuthData({ ...data.user }));
      } catch (error) {
        console.error("Dispatch Error -->", error);
        handleGlobalError(error);
      } finally {
        setIsPending(false);
      }

      router.dismissAll();
      router.replace("/(tabs)");

      // setFormSubmitError({
      //   isError: false,
      //   message: response?.data?.message,
      // });
    } catch (error) {
      handleGlobalError(error);
      console.error("OTP verfication page: -->", error);
      setFormSubmitError({
        isError: true,
        message: error?.response?.data?.message,
      });
    }
  });

  useEffect(() => {
    let resendTimer;
    // console.log(isResendOTPEnabled);
    if (!isResendOTPEnabled) {
      resendTimer = setInterval(() => {
        setResendOTPTimeout((prev) => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            clearInterval(resendTimer);
            setIsResendOTPEnabled(true);
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      clearInterval(resendTimer);
    };
  }, [isResendOTPEnabled]);

  useEffect(() => {
    setFormSubmitError(false);
    setFinalOtp(otp.join(""));
  }, [otp]);

  const router = useRouter();

  useEffect(() => {
    setIsFinalOTPValid(isValid4DigitOtp(finalOtp));
  }, [finalOtp]);

  return (
    <SafeAreaView className="bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false,
        }}
      />
      <ScrollView
        className="px-4 h-full w-full"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 40,
        }}>
        <View className="flex flex-col gap-y-5 items-center w-full">
          <Text className="self-start w-full text-[28px] font-[roboto-mid]">
            Almost there
          </Text>
          <Text className="font-[roboto-light] text-[18px] self-start mb-5">
            Hi <Text className="font-[roboto-mid]">{name}</Text>, Please enter
            4-digit code sent to your mobile no{" "}
            <Text className="font-[roboto-mid]">{mobileNo}</Text> for
            verification
          </Text>
          <View className="flex flex-row items-center justify-center gap-x-4 w-full">
            <TextInput
              style={
                formSubmitError?.isError
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[0]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[roboto-mid] text-[16px] text-center text-[black]"
              maxLength={1}
              minLength={1}
              onKeyPress={handleOTPkeyPress}
              placeholder="_"
              onFocus={() => {
                setOtpFieldIndex(0);
              }}
            />
            <TextInput
              style={
                formSubmitError?.isError
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[1]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[roboto-mid] text-[16px] text-center text-[black]"
              maxLength={1}
              minLength={1}
              placeholder="_"
              onKeyPress={handleOTPkeyPress}
              onFocus={() => {
                setOtpFieldIndex(1);
              }}
            />
            <TextInput
              style={
                formSubmitError?.isError
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[2]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[roboto-mid] text-[16px] text-center text-[black]"
              maxLength={1}
              minLength={1}
              placeholder="_"
              onKeyPress={handleOTPkeyPress}
              onFocus={() => {
                setOtpFieldIndex(2);
              }}
            />
            <TextInput
              style={
                formSubmitError?.isError
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[3]}
              inputMode="numeric"
              className={`h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[roboto-mid] text-[16px] text-center text-[black]`}
              maxLength={1}
              minLength={1}
              placeholder="_"
              onKeyPress={handleOTPkeyPress}
              onFocus={() => {
                setOtpFieldIndex(3);
              }}
            />
          </View>
          {finalOtp === "____" ? (
            <Text className="font-[roboto-mid]">Enter 4 digit OTP</Text>
          ) : !isFinalOTPValid ? (
            <Text className="font-[roboto-mid] text-[#EA4335]">
              Enter proper 4 digit OTP
            </Text>
          ) : !formSubmitError?.isError ? (
            <Text className="font-[roboto-mid]">All set hit verify button</Text>
          ) : (
            <Text className="animate-pulse font-[roboto-bold] text-[#EA4335]">
              {formSubmitError?.message ||
                "Server error, kindly try after some time!"}
            </Text>
          )}
          <Pressable
            disabled={formSubmitError.isError || !isFinalOTPValid}
            className={`flex justify-center items-center h-[55px] w-[90%] ${!isFinalOTPValid ? "bg-green-200" : "bg-green-500"} border-none outline-none rounded-lg`}
            onPress={handleOTPSubmit}>
            {isPending ? (
              <ActivityIndicator size={30} color={"white"} />
            ) : (
              <Text className="text-[20px] text-white font-[roboto-bold]">
                Verify
              </Text>
            )}
          </Pressable>
        </View>
        <View className="flex flex-col gap-y-2">
          <Text className="font-[roboto-bold] text-[15.8px] text-center">
            Didn't recieve any code?{" "}
            {resendOTPTimeout <= 0 && (
              <Text
                onPress={() => {
                  if (resendOTPTimeout <= 0) {
                    handleResendOTP();
                  }
                }}
                className={`underline text-green-900`}>
                Resend Again
              </Text>
            )}
          </Text>
          <Text className="text-center font-[roboto-mid] text-[#7F7E7F] text-[16px]">
            Request new code in{" "}
            <Text className="font-[roboto-bold]">00:{resendOTPTimeout}s</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
