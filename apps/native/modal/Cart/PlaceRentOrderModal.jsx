import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { orderRefetch } from "@store/rtk/slices/orderSlice";

function PlaceOrderModal({
  modalVisible,
  setModalVisible,
  orderPlaceStatus,
  errorMsg,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [redirectRemaining, setRedirectRemaining] = useState(10);

  const timerRef = useRef(null);

  useEffect(() => {
    (() => {
      if (orderPlaceStatus !== "success") {
        return clearImmediate(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setRedirectRemaining((prev) => {
          console.log(timerRef.current);
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setModalVisible(false);
            dispatch(orderRefetch(1));
            router.replace("/(tabs)/my_orders");
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    })();

    return () => {
      clearInterval(timerRef.current);
    };
  }, [orderPlaceStatus]);

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        className="flex-1 items-center justify-center mt-[22px]">
        {orderPlaceStatus === "pending" ? (
          <View
            style={styles.modalView}
            className="m-[20px] bg-white rounded-md p-[35px] flex items-center w-[70%]">
            <ActivityIndicator size={40} color={"#514FB6"} />
            <Text className="mt-5 text-md text-center">
              Please Wait, while we are processing your order
            </Text>
          </View>
        ) : orderPlaceStatus === "success" ? (
          <View
            style={styles.modalView}
            className="m-[20px] bg-white rounded-md p-[35px] flex items-center w-[70%]">
            {/* <View className="flex-row items-center justify-center w-full"> */}
            <AntDesign name="checkcircleo" size={45} color="#514FB6" />
            {/* </View> */}
            <Text className="mt-5 text-lg font-bold text-center">
              Order Placed
            </Text>
            <Text className="mt-2 text-sm text-center underline">
              Redirecting To My Order Section in {redirectRemaining} sections
            </Text>
            <Pressable
              className="w-full mx-2 bg-dark-purple rounded-md h-10 items-center justify-center mt-4"
              onPress={() => {
                setModalVisible(false);
                clearInterval(timerRef.current);
                dispatch(orderRefetch());
                if (router.canDismiss()) {
                  router.dismiss();
                }
                router.replace("/(tabs)/my_orders");
              }}>
              <Text style={styles.textStyle}>My Orders</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={styles.modalView}
            className="m-[20px] bg-white rounded-md p-[35px] flex items-center w-[70%]">
            <Text className="mt-5 text-lg font-bold text-center">
              Order Failed
            </Text>
            <Text className="mt-2 text-sm text-center">
              {!!errorMsg
                ? errorMsg
                : "Something went wrong, please try again later."}
            </Text>
            <Pressable
              className="w-full mx-2 bg-dark-purple rounded-md h-10 items-center justify-center mt-4"
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default PlaceOrderModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
