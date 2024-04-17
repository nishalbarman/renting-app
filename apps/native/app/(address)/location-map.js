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
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  addressForCoordinate,
} from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import * as Location from "expo-location";
import { setAddressDataFromMap } from "@store/rtk/slices/addressSlice";
import { useDispatch } from "react-redux";
import AnimateSpin from "../../components/AnimateSpin/AnimateSpin";
import { EvilIcons } from "@expo/vector-icons";

import { Stack, useRouter } from "expo-router";

function LocationMap() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLocationNotEnabledModalOpen, setIsLocationNotEnabledModalOpen] =
    useState(false);

  const [isIntitalUILoading, setIsInitialUILoading] = useState(false);

  const [loading, setLoading] = useState(false); // loading for the select button
  const [isPending, startTransition] = useTransition();

  const mapViewRef = useRef(null);

  const { height, width } = Dimensions.get("window");

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);

  const handleOnRegionChange = (region) => {
    setSelectedLocation(region);
  };

  const [userLocationEnabled, setUserLocationEnabled] = useState(false);

  useEffect(() => {
    // get address from the coordinates
    (async () => {
      if (!selectedLocation) {
        return;
      }
      let resAddress = await mapViewRef?.current?.addressForCoordinate({
        longitude: selectedLocation?.longitude,
        latitude: selectedLocation?.latitude,
      });
      setAddress(resAddress);
    })();
  }, [selectedLocation]);

  const askLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setUserLocationEnabled(false);
      setIsLocationNotEnabledModalOpen(true);
      return;
    }
    console.log("Location permission granted");
    let location = await Location.getCurrentPositionAsync({});
    mapViewRef?.current?.animateToRegion(location.coords, 100);
    setSelectedLocation(location.coords);
    setUserLocationEnabled(true);
    setIsLocationNotEnabledModalOpen(false);
    setIsInitialUILoading(false);
  };

  useEffect(() => {
    // ask for location permission
    askLocationPermission();
  }, []);

  const handleTryPermissionAgain = () => askLocationPermission();

  const handleSelectAddress = (e) => {
    if (!address) return;
    setLoading(true);
    startTransition(() => {
      dispatch(
        setAddressDataFromMap({
          coordinates: selectedLocation,
          address: address,
        })
      );
    });
    setLoading(false);
    router.dismiss();
  };

  return (
    <View className="bg-white relative h-full w-full">
      <Stack.Screen
        options={{
          title: "Select Location",
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
            provider={PROVIDER_GOOGLE}
            style={{ width: width }}
            className="h-full"
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            loadingEnabled={true}
            onPress={(location) => {
              handleOnRegionChange(location.nativeEvent.coordinate);
            }}>
            {!!selectedLocation && (
              <Marker
                pinColor={"#d59ded"}
                coordinate={{
                  latitude: selectedLocation?.latitude,
                  longitude: selectedLocation?.longitude,
                }}
              />
            )}
          </MapView>
          <View className="w-[100%] items-center rounded-md flex-col gap-y-2">
            <View
              onStartShouldSetResponder={(event) => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              className="w-fit bg-white h-fit p-4 flex flex-col justify-center items-center rounded-md"
              style={{ position: "absolute", bottom: 50 }}>
              <Text className="text-[12px] font-[poppins]">
                {!!address
                  ? `${address?.name}, ${address?.thoroughfare} ${address?.locality}, ${address?.postalCode}, ${address?.country}`
                  : "Not Selected"}
              </Text>

              <TouchableOpacity
                onStartShouldSetResponder={(event) => true}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
                onPress={handleSelectAddress}
                disabled={!address}
                className="flex-row items-center border border-dark-purple justify-start p-1 pl-3 pr-3 rounded-md mt-2 disabled:bg-light-purple">
                {loading || isPending ? (
                  <ActivityIndicator size={10} color={"purple"} />
                ) : (
                  <>
                    <View className="h-[20px] w-[20px] rounded-full bg-dark-purple items-center justify-center">
                      <MaterialIcons name="done" size={10} color="white" />
                    </View>
                    <Text className="ml-1 align-middle font-[poppins] text-[12px]">
                      Select
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
