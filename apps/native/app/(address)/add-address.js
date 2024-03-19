import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { useAddAddressMutation } from "@store/rtk/apis/addressApi";
import { setAddressDataFromMap } from "@store/rtk/slices/addressSlice";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import { Toast } from "expo-react-native-toastify";

import { useRouter } from "expo-router";

import { Stack } from "expo-router";

const LogoTitle = (props) => {
  return (
    <Text className="font-[poppins-xbold] text-[18px]">
      Choose your location
    </Text>
  );
};

export default function AddAddress() {
  const dispatch = useDispatch();

  const { address, coordinates } = useSelector(
    (state) => state.mapSelectedAddress
  );

  const [formData, setFormData] = useState({
    name: { value: "", isTouched: false, isError: false },
    streetName: {
      value: "",
      isTouched: false,
      isError: false,
    },
    locality: {
      value: "",
      isTouched: false,
      isError: false,
    },
    // city: { value: "", isTouched: true, isError: false },
    country: { value: "", isTouched: false, isError: false },
    postalCode: {
      value: "",
      isTouched: false,
      isError: false,
    },
    longitude: {
      value: "",
      isTouched: false,
      isError: false,
    },
    latitude: {
      value: "",
      isTouched: false,
      isError: false,
    },
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(
      !formData.streetName.isTouched ||
        formData.streetName.isError ||
        !formData.locality.isTouched ||
        formData.locality.isError ||
        !formData.country.isTouched ||
        formData.country.isError ||
        !formData.postalCode.isTouched ||
        formData.postalCode.isError
    );
  }, [formData]);

  useEffect(() => {
    setFormData({
      name: { value: address?.name || "", isTouched: true, isError: false },
      streetName: {
        value: address?.thoroughfare || "",
        isTouched:
          !!address?.thoroughfare && address?.thoroughfare !== undefined,
        isError: false,
      },
      locality: {
        value: address?.locality || "",
        isTouched: !!address?.locality && address?.locality !== undefined,
        isError: false,
      },
      // city: { value: "", isTouched: true, isError: false },
      country: {
        value: address?.country || "",
        isTouched: !!address?.country && address?.country !== undefined,
        isError: false,
      },
      postalCode: {
        value: address?.postalCode || "",
        isTouched: !!address?.postalCode && address?.postalCode !== undefined,
        isError: false,
      },
      longitude: {
        value: coordinates?.longitude || "",
        isTouched:
          !!coordinates?.longitude && coordinates?.longitude !== undefined,
        isError: false,
      },
      latitude: {
        value: coordinates?.latitude || "",
        isTouched:
          !!coordinates?.latitude && coordinates?.latitude !== undefined,
        isError: !coordinates?.latitude,
      },
    });
  }, [address, coordinates]);

  const router = useRouter();
  const handleChooseLocationOnMap = () => {
    router.push("/location-map");
  };

  const [addNewAddress, { isError, isLoading }] = useAddAddressMutation();

  const handleAddNewAddress = async (e) => {
    try {
      const extractedFormData = Object.keys(formData).reduce(
        (finalData, key) => ({ [key]: formData[key].value, ...finalData }),
        {}
      );

      const response = await addNewAddress({
        address: extractedFormData,
      }).unwrap();
      if (response.status == 200) {
        dispatch(setAddressDataFromMap({ address: null, coordinates: null }));
      }
      console.log(response);
      Toast.success(response.message);
      router.dismiss();
    } catch (error) {
      Toast.error(error?.data?.message || "Address add failed!");
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: (props) => <LogoTitle {...props} />,
        }}
      />
      <ScrollView className="bg-white">
        <View className="flex flex-col items-start gap-y-2 pb-10 px-5 min-h-screen">
          {/* <Text className="font-[poppins-xbold] text-[18px]">
            Choose your location
          </Text> */}
          <Text className="font-[poppins] text-[15px] text-gray">
            Choose your location to get started adding your address
          </Text>

          <View className="w-[100%] flex flex-col gap-y-[13px] items-center mt-1">
            <TouchableOpacity
              onPress={handleChooseLocationOnMap}
              className="h-[60px] w-[100%] pl-4 pr-7 border-none outline-none bg-[#F1F0F0] flex flex-row justify-between items-center rounded-lg">
              <TextInput
                className="mr-2 rounded-lg font-[poppins-mid] placeholder:text-[16px] placeholder:text-[#8a8a8a] text-#8a8a8a"
                editable={false}
                multiline={false}
                placeholder="Choose your location"
                value={`${formData.name.value || "Select to add address"} ${formData.streetName.value}`}
              />
              <FontAwesome6
                name="location-crosshairs"
                size={24}
                color="#c9c9c9"
              />
            </TouchableOpacity>

            <View className="bg-[#D1D3D7] w-[100%] h-[1px] mb-2"></View>

            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
                editable={true}
                multiline={false}
                placeholder="Street Name"
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    streetName: {
                      ...prev["streetName"],
                      value: text,
                      isTouched: true,
                      isError: !text,
                    },
                  }));
                }}
                value={formData.streetName.value}
              />
              {/* <Foundation name="telephone" size={29} color="#A9A8A8" /> */}
            </View>

            {formData.streetName.isError && (
              <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                * Minimum 5 characters
              </Text>
            )}

            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] inline-block rounded-lg font-[poppins-mid] placeholder:text-[16px]"
                editable={true}
                multiline={false}
                inputMode="text"
                placeholder="Locality"
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    locality: {
                      ...prev["locality"],
                      value: text,
                      isTouched: true,
                      isError: !text,
                    },
                  }));
                }}
                value={formData.locality.value}
              />
              {/* <Fontisto name="email" size={26} color="#A9A8A8" /> */}
            </View>

            {formData.locality.isError && (
              <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                * Minimum 2 characters
              </Text>
            )}

            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] rounded-lg font-[poppins-mid] placeholder:text-[16px]"
                editable={true}
                multiline={false}
                inputMode="numeric"
                placeholder="Postal Code"
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: {
                      ...prev["postalCode"],
                      value: text,
                      isTouched: true,
                      isError: !text,
                    },
                  }));
                }}
                value={formData.postalCode.value}
              />
            </View>

            {formData.postalCode.isError && (
              <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                * Invalid postal code
              </Text>
            )}

            <View className="h-[60px] w-[100%] p-[0px_6%] border-none outline-none bg-[#F1F0F0] flex flex-row justify-around items-center rounded-lg">
              <TextInput
                className="h-[100%] w-[100%] rounded-lg font-[poppins-mid] placeholder:text-[16px]"
                editable={true}
                multiline={false}
                inputMode="text"
                placeholder="Country"
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    country: {
                      ...prev["country"],
                      value: text,
                      isTouched: true,
                      isError: !text,
                    },
                  }));
                }}
                value={formData.country.value}
              />
            </View>

            {formData.country.isError && (
              <Text className="self-start text-[14px] font-[poppins-bold] text-[#EA1E24] mb-1">
                * Minimum 2 digits
              </Text>
            )}
          </View>

          <View className="w-[100%] flex flex-col gap-y-6 items-center mt-[-1px]">
            <TouchableHighlight
              underlayColor={"[#6C63FF"}
              onPress={handleAddNewAddress}
              disabled={isLoading}
              className={`flex justify-center items-center h-[55px] w-[90%] ${isSubmitDisabled ? "bg-[#CECAFF]" : "bg-[#6C63FF]"} border-none outline-none rounded-lg`}>
              <>
                {isLoading || (
                  <Text className="text-[20px] text-white font-[poppins-bold]">
                    Save
                  </Text>
                )}
                {isLoading && (
                  <AnimateSpin>
                    <Feather name="loader" size={24} color="white" />
                  </AnimateSpin>
                )}
              </>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
