import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type stateProps = {
  message: string;
  duration: number;
  isVisible?: boolean;
  actionText: string | false;
};

const initialState: stateProps = {
  message: "How it looks",
  duration: 300,
  isVisible: true,
  actionText: false,
};

export const globalMessage = createSlice({
  name: "global_message",
  initialState,
  reducers: {
    setReduxGlobalMessage: (state, action: PayloadAction<stateProps>) => {
      return { ...state, ...action.payload };
    },
    clearReduxGlobalMessage: () => {
      return initialState;
    },
  },
});

export const { setReduxGlobalMessage, clearReduxGlobalMessage } =
  globalMessage.actions;
