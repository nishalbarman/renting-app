import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { clearLoginSession } from "@store/rtk/slices/authSlice";
import { SheetManager } from "react-native-actions-sheet";

function ReLogin({ modalVisible, setModalVisible }) {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        className="flex-1 items-center justify-center mt-[22px]">
        <View
          style={styles.modalView}
          className="m-[20px] bg-white rounded-md p-[35px] flex items-center w-[70%]">
          <Text className="mt-5 text-lg font-bold text-center">
            Update Successful
          </Text>
          <Text className="mt-2 text-sm text-center">
            Profile successfully updated, you will be logged out.
            {/* Something went wrong, please try again later. */}
          </Text>
          <Pressable
            className="w-full mx-2 bg-dark-purple rounded-md h-10 items-center justify-center mt-4"
            onPress={() => {
              setModalVisible(false);
              dispatch(clearLoginSession());
              SheetManager.hide("update-profile");
              try {
                router.dismissAll();
                router.replace("/auth/login");
              } catch (err) {}
            }}>
            <Text style={styles.textStyle}>Login Again</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default ReLogin;

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
