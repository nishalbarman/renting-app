import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";

function LocationMap() {
  const handlers = useScrollHandlers();

  const { height, width } = Dimensions.get("window");

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] = useState();

  const handleOnRegionChange = (region) => {
    setRegion(region);
  };

  return (
    <ActionSheet closeOnPressBack={true} gestureEnabled={true}>
      <NativeViewGestureHandler
        simultaneousHandlers={handlers.simultaneousHandlers}>
        <ScrollView {...handlers}>
          <MapView
            style={{ height: height, width: width }}
            className="w-[100%]"
            onRegionChange={handleOnRegionChange}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
        </ScrollView>
      </NativeViewGestureHandler>
    </ActionSheet>
  );
}

export default LocationMap;
