import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";

const AllRoutes: React.FC = () => {
  const [navbarToogle, setNavbarToogle] = React.useState<Boolean>(true);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <div className="flex flex-1 flex-col">
            <Dashboard setNavbarToogle={setNavbarToogle} />
          </div>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
