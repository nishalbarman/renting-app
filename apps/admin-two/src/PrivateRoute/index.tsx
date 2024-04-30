import { useAppSelector } from "@store/rtk";
import React from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.jwtToken) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
