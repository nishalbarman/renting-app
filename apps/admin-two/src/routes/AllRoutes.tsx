import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import AddNewCenter from "../components/center/AddCenter";
import CenterList from "../components/center/CenterList";
import ProductAdd from "../components/ProductsSection/ProductAdd";
import ProductList from "../components/ProductsSection/ProductList";
import OrderList from "../components/OrderSection/OrdersList";
import ViewSingleOrder from "../components/OrderSection/ViewOrder";

const AllRoutes: React.FC = () => {
  const [navbarToogle, setNavbarToogle] = React.useState<Boolean>(true);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<Dashboard setNavbarToogle={setNavbarToogle} />}
      />
      <Route path="/center/add" element={<AddNewCenter />} />
      <Route path="/center/list" element={<CenterList />} />
      <Route path="/product/add" element={<ProductAdd />} />
      <Route path="/product/list" element={<ProductList />} />
      <Route path="/orders/list" element={<OrderList />} />
      <Route path="/orders/view" element={<ViewSingleOrder />} />
    </Routes>
  );
};

export default AllRoutes;

{
  /* <div className="flex flex-1 flex-col">
<Dashboard setNavbarToogle={setNavbarToogle} />
</div> */
}