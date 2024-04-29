import React from "react";
import Sidebar from "./components/Sidebar";
import "./index.css";
import AllRoutes from "./routes/AllRoutes";
import { useLocation } from "react-router-dom";
import { RiMenuLine } from "react-icons/ri";

function App() {
  const [navbarToogle, setNavbarToogle] = React.useState<boolean>(true);

  let location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {location.pathname !== "/login" && (
        <>
          <div
            className="md:hidden px-5 bg-white h-14 flex items-center"
            onClick={() => {
              setNavbarToogle((prev: boolean) => !prev);
            }}>
            <RiMenuLine size={30} />
          </div>
          <Sidebar
            navbarToogle={navbarToogle}
            setNavbarToogle={setNavbarToogle}
          />
        </>
      )}
      <AllRoutes />
    </div>
  );
}

export default App;
