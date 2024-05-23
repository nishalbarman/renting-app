import { setReduxGlobalMessage } from "@store/rtk";
import Toast from "react-native-toast-message";

export default function handleGlobalError(error) {
  console.log("Error message from global error --> ", error);

  Toast.show({
    type: "err",
    text1:
      error?.response?.data?.message ||
      error?.message ||
      "Unkwown error occured",
  });
}
