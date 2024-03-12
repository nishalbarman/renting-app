import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValid4DigitOtp } from "validator";

export default function Page() {
  const searchParams = useLocalSearchParams();

  console.log("Search Paramas Verify OTP -->", searchParams);

  const name = searchParams.name || "Anonymous";
  const mobileNo = searchParams.mobileNo || "910*****906";
  const email = searchParams.email || "user@email.test";
  const password = searchParams.password || "123";

  const [isResendOTPEnabled, setIsResendOTPEnabled] = useState(false);
  const [resendOTPTimeout, setResendOTPTimeout] = useState(30);

  const handleResendOTP = async () => {
    try {
      if (isResendOTPEnabled) {
        // const response = await doFetch()
        // { name, mobileNo, email }
      }
    } catch (error) {
      console.error("Resend OTP error => ", error);
    }
  };

  useEffect(() => {
    let resendTimer;
    console.log(isResendOTPEnabled);
    if (!isResendOTPEnabled) {
      resendTimer = setInterval(() => {
        setResendOTPTimeout((prev) => {
          const newTimer = prev - 1;
          console.log(newTimer);

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

  const [otp, setOtp] = useState(["_", "_", "_", "_"]);
  const [otpFieldIndex, setOtpFieldIndex] = useState(0);
  const [finalOtp, setFinalOtp] = useState(otp.join(""));

  const [isFinalOTPValid, setIsFinalOTPValid] = useState(false);

  const [formSubmitError, setFormSubmitError] = useState({
    isError: false,
    message: "",
  });

  const otpBoxesRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]; // references for input fields

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

  useEffect(() => {
    setFormSubmitError(false);
    setFinalOtp(otp.join(""));
  }, [otp]);

  const router = useRouter();

  const handleOTPSubmit = () => {
    try {
      // TODO : post the object

      console.log(finalOtp);

      if (finalOtp !== "1234") {
        setFormSubmitError({
          isError: true,
          message:
            "OTP verification failed, kindly check and enter correct OTP.",
        });
      } else {
        router.dismissAll();
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OTP verfication page: -->", error);
    }
  };

  useEffect(() => {
    setIsFinalOTPValid(isValid4DigitOtp(finalOtp));
  }, [finalOtp]);

  return (
    <SafeAreaView className="bg-white">
      <ScrollView
        className="p-[15px] h-[100%] pt-[10%] w-[100%]"
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 40,
        }}>
        <View className="flex flex-col gap-y-10 items-center w-[100%]">
          <Text className="self-start w-[100%] text-[28px] font-[poppins-mid]">
            Almost there
          </Text>
          <Text className="font-[poppins-light] text-[18px] self-start">
            Hi <Text className="font-[poppins-mid]">{name}</Text>, Please enter
            4-digit code sent to your mobile no{" "}
            <Text className="font-[poppins-mid]">{mobileNo}</Text> for
            verification
          </Text>
          <View className="flex flex-row items-center justify-center gap-x-4 w-[100%]">
            <TextInput
              style={
                formSubmitError?.isError || !isFinalOTPValid
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[0]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[poppins-mid] text-[16px] text-center text-[black]"
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
                formSubmitError?.isError || !isFinalOTPValid
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[1]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[poppins-mid] text-[16px] text-center text-[black]"
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
                formSubmitError?.isError || !isFinalOTPValid
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[2]}
              inputMode="numeric"
              className="h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[poppins-mid] text-[16px] text-center text-[black]"
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
                formSubmitError?.isError || !isFinalOTPValid
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                      color: "red",
                    }
                  : {}
              }
              ref={otpBoxesRefs[3]}
              inputMode="numeric"
              className={`h-[54px] w-[54px] rounded-[10px] bg-[#F1F0F0] font-[poppins-mid] text-[16px] text-center text-[black]`}
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
            <Text className="font-[poppins-mid]">Enter 4 digit OTP</Text>
          ) : !isFinalOTPValid ? (
            <Text className="font-[poppins-mid] text-[#EA4335]">
              Enter proper 4 digit OTP
            </Text>
          ) : !formSubmitError?.isError ? (
            <Text className="font-[poppins-mid]">
              All set hit verify button
            </Text>
          ) : (
            <Text className="animate-pulse font-[poppins-bold] text-[#EA4335]">
              {formSubmitError?.message ||
                "Server error, kindly try after some time!"}
            </Text>
          )}
          <TouchableOpacity
            className={`flex justify-center items-center h-[55px] w-[90%] ${!isFinalOTPValid ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg`}
            onPress={handleOTPSubmit}>
            <Text className="text-[20px] text-white font-[poppins-bold]">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-col gap-y-2">
          <Text className="font-[poppins-bold] text-[15.8px] text-center">
            Didn't recieve any code?{" "}
            {resendOTPTimeout <= 0 && (
              <Text
                onPress={() => {
                  if (resendOTPTimeout <= 0) {
                    handleResendOTP();
                  }
                }}
                className={`underline text-[#6C63FF]`}>
                Resend Again
              </Text>
            )}
          </Text>
          <Text className="text-center font-[poppins-mid] text-[#7F7E7F] text-[16px]">
            Request new code in{" "}
            <Text className="font-[poppins-bold]">00:{resendOTPTimeout}s</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
