import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const AnimateSpin = ({ children }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    spin();
  }, []);

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };

  const spinAnimation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spinAnimation }] }}>
      {children}
    </Animated.View>
  );
};

export default AnimateSpin;
