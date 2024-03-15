import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import MapView, { Marker, addressForCoordinate } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

function LocationMap() {
  const handlers = useScrollHandlers();
  const mapViewRef = useRef(null);

  const { height, width } = Dimensions.get("window");
  const [address, setAddress] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 26.1717337,
    longitude: 91.7667775,
  });

  const handleOnRegionChange = (region) => {
    setSelectedLocation(region);
  };

  const [userLocationEnabled, setUserLocationEnabled] = useState(null);

  useEffect(() => {
    // get address from the coordinates
    (async () => {
      let resAddress = await mapViewRef?.current?.addressForCoordinate({
        longitude: selectedLocation?.longitude,
        latitude: selectedLocation?.latitude,
      });
      console.log(resAddress);
      setAddress(resAddress);
    })();
  }, [selectedLocation]);

  useEffect(() => {
    // ask for location permission
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setUserLocationEnabled(false);
        return;
      }
      console.log("Location permission granted");
      setUserLocationEnabled(true);
    })();
  }, []);

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <View style={{ height: height, width: width }}>
        <MapView
          ref={mapViewRef}
          style={{ height: height, width: width }}
          showsUserLocation={userLocationEnabled}
          followsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          onPress={(location) => {
            handleOnRegionChange(location.nativeEvent.coordinate);
          }}>
          <Marker
            pinColor={"#d59ded"}
            coordinate={{
              latitude: selectedLocation?.latitude,
              longitude: selectedLocation?.longitude,
            }}
          />
        </MapView>
        <View className="w-[100%] items-center rounded-md flex-col gap-y-2">
          <View
            className="w-fit bg-white h-fit p-4 flex flex-col justify-center items-center rounded-md"
            style={{ position: "absolute", bottom: 50 }}>
            <Text className="text-[12px] font-[poppins]">
              {!!address
                ? `${address?.locality}, ${address?.name}, ${address?.postalCode}, ${address?.country}`
                : "Not Selected"}
            </Text>

            <TouchableOpacity className="flex-row items-center border border-dark-purple justify-start p-1 pl-3 pr-3 rounded-md mt-2">
              <View className="h-[20px] w-[20px] rounded-full bg-dark-purple items-center justify-center">
                <MaterialIcons name="done" size={10} color="white" />
              </View>
              <Text className="ml-1 align-middle font-[poppins] text-[12px]">
                Select
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}

export default LocationMap;
