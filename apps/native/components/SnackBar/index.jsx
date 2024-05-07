import { clearReduxGlobalMessage } from "@store/rtk";
import React, { memo, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";

const Snackbar = ({ position = "bottom" }) => {
  const dispatch = useDispatch();

  const { isVisible, duration, message, actionText } = useSelector(
    (state) => state.global_message
  );

  const restoreMessage = () => {
    dispatch(clearReduxGlobalMessage());
  };

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(restoreMessage, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  return true ? (
    <View className="w-[98%] h-12 flex-row justify-between items-center px-4 rounded-md fixed bottom-0 my-5 bg-black self-center">
      <Text className="text-white font-bold">I am the text</Text>
      <TouchableOpacity onPress={restoreMessage}>
        {/* <Text style={[styles.actionText]}>dismiss</Text> */}
        <Entypo name="cross" size={24} color="white" />
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 15,
  },
  messageText: {
    fontSize: 16,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default memo(Snackbar);
