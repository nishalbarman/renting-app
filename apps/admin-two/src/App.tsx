import React from "react";
import Sidebar from "./components/Sidebar";
import "./index.css";
import AllRoutes from "./routes/AllRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const [navbarToogle, setNavbarToogle] = React.useState<Boolean>(true);

  let location = useLocation();
  console.log(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {location.pathname !== "/login" && (
        <Sidebar
          navbarToogle={navbarToogle}
          setNavbarToogle={setNavbarToogle}
        />
      )}
      <AllRoutes />
    </div>
  );
}

export default App;
