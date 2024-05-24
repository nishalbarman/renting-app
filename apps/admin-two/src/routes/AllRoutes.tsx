import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import AddNewCenter from "../components/CenterSection/AddCenter";
import CenterList from "../components/CenterSection/CenterList";
import ProductAdd from "../components/ProductsSection/ProductAdd";
import ProductList from "../components/ProductsSection/ProductList";
import OrderList from "../components/OrderSection/OrdersList";
import ViewSingleOrder from "../components/OrderSection/ViewOrder";
import CategoryList from "../components/CategorySection/CategoryList";
import PrivateRoute from "../PrivateRoute";

const AllRoutes: React.FC = () => {
  const [navbarToogle, setNavbarToogle] = React.useState<Boolean>(true);
  console.log(navbarToogle);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard setNavbarToogle={setNavbarToogle} />
          </PrivateRoute>
        }
      />
      <Route
        path="/center/add"
        element={
          <PrivateRoute>
            <AddNewCenter />
          </PrivateRoute>
        }
      />
      <Route
        path="/center/list"
        element={
          <PrivateRoute>
            <CenterList />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/add"
        element={
          <PrivateRoute>
            <ProductAdd />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/list"
        element={
          <PrivateRoute>
            <ProductList />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders/list"
        element={
          <PrivateRoute>
            <OrderList />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders/view"
        element={
          <PrivateRoute>
            <ViewSingleOrder />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <CategoryList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;

{
  /* <div className="flex flex-1 flex-col">
<Dashboard setNavbarToogle={setNavbarToogle} />
</div> */
}
