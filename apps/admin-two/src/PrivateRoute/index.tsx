import { type RootState } from "@store/rtk";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.jwtToken) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
