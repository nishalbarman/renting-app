import React from "react";
import { Provider } from "react-redux";

export default function _Layout({ children }) {
  return <Provider store={{}}>{children}</Provider>;
}
