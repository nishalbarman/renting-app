import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import * as Location from "expo-location";
import { setAddressDataFromMap } from "@store/rtk/slices/addressSlice";
import { useDispatch, useSelector } from "react-redux";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import { EvilIcons } from "@expo/vector-icons";

import { Stack, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useGetCenterAddressQuery } from "@store/rtk/apis/centerAddresApi";
import { setCenterAddress } from "@store/rtk/slices/centerAddressSlice";

function LocationMap() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLocationNotEnabledModalOpen, setIsLocationNotEnabledModalOpen] =
    useState(false);

  const [isIntitalUILoading, setIsInitialUILoading] = useState(false);

  const [loading, setLoading] = useState(false); // loading for the select button

  const mapViewRef = useRef(null);

  const askLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsLocationNotEnabledModalOpen(true);
      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    mapViewRef?.current?.animateToRegion(location.coords, 100);

    // setSelectedLocation(location.coords);
    setIsLocationNotEnabledModalOpen(false);
    setIsInitialUILoading(false);
  };

  useEffect(() => {
    // ask for location permission
    askLocationPermission();
  }, []);

  const handleTryPermissionAgain = () => askLocationPermission();

  const {
    data: centerAddresses,
    isLoading: isCenterLoadingAddress,
    isFethcing: isCenterFetchingAddress,
    error,
  } = useGetCenterAddressQuery();

  // const selectedCenterDetails = useSelector(
  //   (state) => state.selectedCenterDetails
  // );

  const [selectedCenterAddress, setSelectedCenterAddress] = useState(null);

  const handleSelectAddress = (e) => {
    if (Object.keys(selectedCenterAddress).length <= 0) {
      throw new Error("Center address is not in proper format");
    }

    setLoading(true);
    dispatch(setCenterAddress(selectedCenterAddress));
    setLoading(false);
    router.dismiss();
  };

  const handleSelectedCenter = (center) => {
    setSelectedCenterAddress(center);
  };

  return (
    <View className="bg-white relative h-full w-full">
      <Stack.Screen
        options={{
          title: "Select Center Location",
          headerShown: true,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />

      {isLocationNotEnabledModalOpen && (
        <View className="h-[90%] w-full flex justify-center items-center">
          <Text className="text-lg tex-bold text-center mb-3">
            You need to allow permission to be able to select location!. If you
            are seeing this message even after allowing the permission try to
            relaunch the application. If the issue still persists a message
            would be appriciated.
          </Text>
          <TouchableOpacity
            className="h-10 px-4 bg-purple flex items-center justify-center rounded-md"
            onPress={handleTryPermissionAgain}>
            <Text className="text-lg text-bold text-white">Ask Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {isIntitalUILoading ? (
        <View className="min-h-screen w-full flex items-center justify-center">
          <ActivityIndicator size={40} />
        </View>
      ) : (
        <>
          <MapView
            ref={mapViewRef}
            className="h-full w-full"
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
            moveOnMarkerPress={true}
            coordinate={{
              latitude: selectedCenterAddress?.latitude || 0,
              longitude: selectedCenterAddress?.longitude || 0,
            }}>
            {!!centerAddresses &&
              centerAddresses.length > 0 &&
              centerAddresses.map((center) => (
                <>
                  <Marker
                    onPress={() => {
                      handleSelectedCenter(center);
                    }}
                    stopPropagation={true}
                    title={center?.centerName}
                    description={center?.centerName || "Nishal Goal Center"}
                    coordinate={{
                      latitude: +center?.latitude,
                      longitude: +center?.longitude,
                    }}>
                    <Image
                      source={{
                        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Go-home.svg/1024px-Go-home.svg.png",
                      }}
                      style={{
                        width: 60,
                        height: 60,
                      }}
                    />
                  </Marker>
                </>
              ))}
          </MapView>

          <View className="w-[100%] px-2 items-center rounded-md flex-col gap-y-2">
            <View
              onStartShouldSetResponder={(event) => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              className="w-fit bg-white h-fit p-4 flex flex-col justify-center items-center rounded-md border border-gray-300 shadow-sm"
              style={{ position: "absolute", bottom: 50 }}>
              <Text className="text-[12px] font-[poppins]">
                {!!selectedCenterAddress
                  ? `${selectedCenterAddress?.name}, ${selectedCenterAddress?.streetName} ${selectedCenterAddress?.locality}, ${selectedCenterAddress?.postalCode}, ${selectedCenterAddress?.country}`
                  : "No Center Selected"}
              </Text>

              <TouchableOpacity
                onStartShouldSetResponder={(event) => true}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
                onPress={handleSelectAddress}
                disabled={
                  !selectedCenterAddress ||
                  Object.keys(selectedCenterAddress).length === 0
                }
                style={{
                  backgroundColor: !selectedCenterAddress
                    ? "#b5b4d6"
                    : "#514FB6",
                }}
                className="flex-row items-center justify-start p-1 pl-3 pr-3 rounded-md mt-2 disabled:bg-light-purple h-10 bg-dark-purple">
                {loading ? (
                  <ActivityIndicator size={20} color={"white"} />
                ) : (
                  <>
                    {/* <View className="h-[20px] w-[20px] rounded-full bg-dark-purple items-center justify-center">
                      <MaterialIcons name="done" size={10} color="white" />
                    </View> */}
                    <Text className="ml-1 align-middle font-[poppins] text-[13px] text-white">
                      Confirm Selection
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default LocationMap;
