import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  // FaEnvelope,
  // FaUsers,
  FaFileAlt,
  // FaCogs,
  // FaKey,
  // FaExchangeAlt,
} from "react-icons/fa";

import { IoMdClose } from "react-icons/io";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  navbarToogle: Boolean;
  setNavbarToogle: any;
};

const Sidebar: React.FC<SidebarProps> = ({ navbarToogle, setNavbarToogle }) => {
  const navigator = useNavigate();

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setWidth(window.innerWidth || window.screen.width);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth || window.screen.width);
    });
  }, []);

  const variants = {
    open: { width: "260px" },
    closed: { width: "0px" },
  };

  const sidebarInnerDivVarient = {
    open: { display: "block" },
    closed: { display: "none" },
  };

  return (
    <motion.div
      // initial={{ width: 0 }}
      animate={width <= 765 ? (navbarToogle ? "closed" : "open") : "open"}
      variants={variants}
      className={`z-50 min-h-screen w-64 bg-gray-800 text-white flex top-0 bottom-0 flex-col fixed ${
        width <= 765 ? (navbarToogle ? "hidden" : "visible") : "visible"
      }`}>
      <motion.div
        animate={width <= 765 ? (navbarToogle ? "closed" : "open") : "open"}
        variants={sidebarInnerDivVarient}
        transition={{ delay: 0.2 }}>
        <div
          className="absolute right-2 top-2 border border-white rounded-sm md:hidden"
          onClick={() => {
            console.log(navbarToogle);
            setNavbarToogle((prev: boolean) => !prev);
          }}>
          <IoMdClose size={20} />
        </div>

        <div className="flex items-center justify-start px-3 h-20 border-b border-gray-700 gap-2">
          <img
            style={{
              filter: "invert(100%)",
              // mixBlendMode: "multiply",
            }}
            src="https://images.simpletire.com/image/upload/v1712328147/360-line-images/5305/5305_SaveroHT2_360_2.jpg"
            className="w-14 h-14"
          />
          <h1 className="text-2xl font-semibold">Savero</h1>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="text-md">
            <li
              onClick={() => {
                navigator("/");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/" && "bg-[rgb(43,49,61)]"}`}>
              <FaTachometerAlt className="mr-4" />
              <span>Dashboard</span>
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-sm text-gray-500">ORDERS</h2>
          <ul className="text-md">
            <li
              onClick={() => {
                navigator("/orders/list");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/orders/list" && "bg-[rgb(43,49,61)]"}`}>
              <FaTachometerAlt className="mr-4" />
              <span>Orders</span>
            </li>
            <li
              onClick={() => {
                navigator("/orders/view");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/orders/view" && "bg-[rgb(43,49,61)]"}`}>
              <FaFileAlt className="mr-4" />
              <span>Track Order</span>
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-sm text-gray-500">PRODUCTS</h2>
          <ul className="text-md">
            <li
              onClick={() => {
                navigator("/product/add");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/product/add" && "bg-[rgb(43,49,61)]"}`}>
              <FaTachometerAlt className="mr-4" />
              <span>Add Product</span>
            </li>
            <li
              onClick={() => {
                navigator("/product/list");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/product/list" && "bg-[rgb(43,49,61)]"}`}>
              <FaFileAlt className="mr-4" />
              <span>View Produts</span>
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-sm text-gray-500">CATEGORIES</h2>
          <ul className="text-md">
            <li
              onClick={() => {
                navigator("/categories");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/categories" && "bg-[rgb(43,49,61)]"}`}>
              <FaTachometerAlt className="mr-4" />
              <span>View Categories</span>
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-sm text-gray-500">CENTER</h2>
          <ul className="text-md">
            <li
              onClick={() => {
                navigator("/center/add");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/center/add" && "bg-[rgb(43,49,61)]"}`}>
              <FaTachometerAlt className="mr-4" />
              <span>Create Center</span>
            </li>
            <li
              onClick={() => {
                navigator("/center/list");
              }}
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/center/list" && "bg-[rgb(43,49,61)]"}`}>
              <FaFileAlt className="mr-4" />
              <span>View Centers</span>
            </li>
          </ul>

          {/* <h2 className="mt-8 mb-4 text-sm text-gray-500">SETTINGS</h2>
          <ul>
            <li
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/" && "bg-[rgb(43,49,61)]"}`}>
              <FaCogs className="mr-4" />
              <span>Roles</span>
            </li>
            <li
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/" && "bg-[rgb(43,49,61)]"}`}>
              <FaKey className="mr-4" />
              <span>Requests</span>
            </li>
            <li
              className={`mb-[1px] flex items-center hover:bg-[rgb(43,49,61)] py-2 px-4 rounded-md cursor-pointer ${location.pathname === "/" && "bg-[rgb(43,49,61)]"}`}>
              <FaExchangeAlt className="mr-4" />
              <span>Preferences</span>
            </li>
          </ul> */}
        </nav>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
