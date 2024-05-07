import { setReduxGlobalMessage } from "@store/rtk";

export default function handleGlobalError(dispatch, error) {
  console.log("Error message from global error --> ", error);

  dispatch(
    setReduxGlobalMessage({
      message:
        error?.response?.message || error?.message || "Some error occured!",
      duration: 3000,
      isVisible: true,
      actionText: "dismiss",
    })
  );
}
