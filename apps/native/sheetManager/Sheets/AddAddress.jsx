import {
  AntDesign,
  Feather,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, {
  SheetManager,
  useScrollHandlers,
} from "react-native-actions-sheet";
import { FontAwesome6 } from "@expo/vector-icons";

import { NativeViewGestureHandler } from "react-native-gesture-handler";
import {
  isValidEmail,
  isValidIndianMobileNumber,
  isValidPassword,
} from "validator";
import { useDispatch, useSelector } from "react-redux";
import { useAddAddressMutation } from "@store/rtk/apis/addressApi";
import { setAddressDataFromMap } from "@store/rtk/slices/addressSlice";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import ToastManager, { Toast } from "expo-react-native-toastify";

export default function AddAddress() {
  const handlers = useScrollHandlers();
  const dispatch = useDispatch();

  const { address, coordinates } = useSelector(
    (state) => state.mapSelectedAddress
  );
  console.log("Getting the address -->", address);
  console.log("Getting the coordinates -->", coordinates);

  const [formData, setFormData] = useState({
    name: { value: "", isTouched: true, isError: null },
    streetName: {
      value: "",
      isTouched: true,
      isError: null,
    },
    locality: {
      value: "",
      isTouched: true,
      isError: null,
    },
    // city: { value: "", isTouched: true, isError: null },
    country: { value: "", isTouched: true, isError: null },
    postalCode: {
      value: "",
      isTouched: true,
      isError: null,
    },
    longitude: {
      value: "",
      isTouched: true,
      isError: null,
    },
    latitude: {
      value: "",
      isTouched: true,
      isError: null,
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
      name: { value: address?.name || "", isTouched: true, isError: null },
      streetName: {
        value: address?.thoroughfare || "",
        isTouched: true,
        isError: null,
      },
      locality: {
        value: address?.locality || "",
        isTouched: true,
        isError: null,
      },
      // city: { value: "", isTouched: true, isError: null },
      country: {
        value: address?.country || "",
        isTouched: true,
        isError: null,
      },
      postalCode: {
        value: address?.postalCode || "",
        isTouched: true,
        isError: null,
      },
      longitude: {
        value: coordinates?.longitude || "",
        isTouched: true,
        isError: null,
      },
      latitude: {
        value: coordinates?.latitude || "",
        isTouched: true,
        isError: null,
      },
    });
  }, [address, coordinates]);

  const handleChooseLocationOnMap = () => [
    SheetManager.show("location-select-map"),
  ];

  const test = useAddAddressMutation();
  console.log("What are the values?", test);
  const [addNewAddress, { isError, isLoading }] = useAddAddressMutation();

  const handleAddNewAddress = async () => {
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
      Toast.success(response.message);
    } catch (error) {
      Toast.error(error?.data?.message || "Address not added");
      console.error(error);
    }
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <View className="pt-3 flex flex-col items-start gap-y-2 pb-10 p-3">
            <Text className="font-[poppins-xbold] text-[18px]">
              Choose your location
            </Text>
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
                  value={`${formData.name.value} ${formData.streetName.value}`}
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
                        isError: false,
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
                        isError: false,
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
                        isError: false,
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
                        isError: false,
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
            <View className="min-h-[100px]"></View>
          </View>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}
