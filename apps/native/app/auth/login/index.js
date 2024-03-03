import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function Page() {
  const [formData, setFormData] = useState({
    mobileNo: { value: null, isTouched: null, isError: null },
    password: { value: null, isTouched: null, isError: null },
  });

  const handleFieldChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: {
        ...prev[e.target.name],
        value: e.target.value,
        isTouched: true,
        isError: null,
      },
    }));
  };

  return (
    <View className="p-[15px] h-[100%] flex flex-col items-center justify-between">
      <View className="w-[100%] flex flex-col items-center gap-3">
        <Image
          className=""
          source={require("../../../assets/illustrations/user_on_bike.png")}
        />
        <Text className="text-[30px] font-[mrt-mid]">Welcome back</Text>
        <Text className="text-[18px] font-[mrt-light]">
          sign in to access your account
        </Text>
      </View>
      <View className="w-[100%] flex flex-col gap-3 justify-start items-center h-[100%] mt-4">
        <View className="h-[60px] w-[100%] p-[0px_5%] border-none outline-none bg-[#F1F0F0] ">
          <TextInput
            className="h-[100%] w-[100%] rounded-[10px] placeholder:text-[mrt-light] placeholder:text-[16px] "
            editable={true}
            multiline={false}
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
            style={{ padding: 10 }}
          />
          <
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
