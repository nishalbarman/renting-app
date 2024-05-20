import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";

import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";

import { setCenterAddress } from "@store/rtk";
import axios from "axios";
import handleGlobalError from "../../lib/handleError";

function LocationMap() {
  const searchParams = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { jwtToken } = useSelector((state) => state.auth);

  const [isLocationNotEnabledModalOpen, setIsLocationNotEnabledModalOpen] =
    useState(false);

  const [isIntitalUILoading, setIsInitialUILoading] = useState(false);

  const [loading, setLoading] = useState(false); // loading for the select button

  const [userCurrentLocation, setUserCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const askLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsLocationNotEnabledModalOpen(true);
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    setUserCurrentLocation(location.coords);
    // console.log(location);

    // mapViewRef?.current?.animateToRegione(location.coords, 100);

    // setSelectedLocation(location.coords);
    setIsLocationNotEnabledModalOpen(false);
    setIsInitialUILoading(false);
  };

  useEffect(() => {
    // ask for location permission
    askLocationPermission();
  }, []);

  const [userCloseCenterList, setUserCloseCenterList] = useState([]);
  const [closestCenter, setClosestCenter] = useState(null);

  const mapViewRef = useRef(null);

  useEffect(() => {
    if (!!closestCenter && !!mapViewRef.current) {
      if (typeof mapViewRef.current.animateToRegion === "function") {
        mapViewRef.current.animateCamera(
          {
            center: {
              latitude: closestCenter?.address.latitude,
              longitude: closestCenter?.address.longitude,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
            altitude: 5,
          },
          500
        );
      }
    }
  }, [closestCenter, mapViewRef]);

  const getCenterLocations = async () => {
    try {
      // console.log(searchParams?.address);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/center/addresses/${searchParams?.address}`,
        {
          headers: {
            authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setUserCloseCenterList(response.data.availableCenters);
      setClosestCenter(response.data.availableCenters[0]);
    } catch (error) {
      console.error(error);
      handleGlobalError(error);
    }
  };

  useEffect(() => {
    getCenterLocations();
  }, []);

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
          title: "Choose Pickup Center",
          headerShown: true,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTitleAlign: "center",
        }}
      />

      {isLocationNotEnabledModalOpen && (
        <View className="min-h-full w-full flex justify-center items-center">
          <Text className="text-lg tex-bold text-center mb-3">
            You need to allow permission to be able to select location!. If you
            are seeing this message even after allowing the permission try to
            relaunch the application. If the issue still persists a message
            would be appriciated.
          </Text>
          <TouchableOpacity
            className="h-10 px-4 bg-purple flex items-center justify-center rounded-md"
            onPress={askLocationPermission}>
            <Text className="text-lg text-bold text-white">Ask Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {isIntitalUILoading ? (
        <View className="min-h-full w-full flex items-center justify-center">
          <ActivityIndicator size={40} />
        </View>
      ) : (
        <>
          <MapView
            ref={(mapView) => {
              mapViewRef.current = mapView;
            }}
            provider={PROVIDER_GOOGLE}
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
            {!!userCloseCenterList &&
              userCloseCenterList.length > 0 &&
              userCloseCenterList.map((center) => (
                <>
                  <Marker
                    onPress={() => {
                      handleSelectedCenter(center);
                    }}
                    stopPropagation={true}
                    title={center?.centerName}
                    description={`Center distance from your location: ${(center?.distance / 1000).toFixed(2)} Km`}
                    coordinate={{
                      latitude: +center?.address?.latitude || 0,
                      longitude: +center?.address?.longitude || 0,
                    }}>
                    <View>
                      <Text className="text-sm text-white bg-black font-[roboto-bold] rounded-md px-2 py-2">
                        {(center?.distance / 1000).toFixed(2)} KM
                      </Text>
                      <Image
                        source={{
                          // uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Go-home.svg/1024px-Go-home.svg.png",
                          uri: "https://cdn-icons-png.freepik.com/512/3183/3183012.png",
                        }}
                        style={{
                          width: 60,
                          height: 60,
                        }}
                      />
                    </View>
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
              {!!selectedCenterAddress ? (
                <>
                  <Text className="text-[14px] font-[roboto-bold]">
                    {selectedCenterAddress.centerName}
                  </Text>
                  <Text className="text-[12px] font-[roboto]">
                    {selectedCenterAddress?.address?.name},{" "}
                    {selectedCenterAddress?.address?.streetName}{" "}
                    {selectedCenterAddress?.address?.locality},{" "}
                    {selectedCenterAddress?.address?.postalCode},{" "}
                    {selectedCenterAddress?.address?.country}
                  </Text>
                </>
              ) : (
                <Text className="text-sm">No Center Selected</Text>
              )}

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
                  backgroundColor: !selectedCenterAddress ? "gray" : "black",
                }}
                className="flex-row items-center justify-start p-1 pl-3 pr-3 rounded-md mt-2 disabled:bg-light-purple h-10 bg-dark-purple">
                {loading ? (
                  <ActivityIndicator size={20} color={"white"} />
                ) : (
                  <>
                    {/* <View className="h-[20px] w-[20px] rounded-full bg-dark-purple items-center justify-center">
                      <MaterialIcons name="done" size={10} color="white" />
                    </View> */}
                    <Text className="ml-1 align-middle font-[roboto] text-[13px] text-white">
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
