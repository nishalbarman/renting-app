import React from "react";
import {
  FaTachometerAlt,
  // FaEnvelope,
  // FaUsers,
  FaFileAlt,
  FaCogs,
  FaKey,
  FaExchangeAlt,
} from "react-icons/fa";

import { IoMdClose } from "react-icons/io";

import { motion } from "framer-motion";

type SidebarProps = {
  navbarToogle: Boolean;
  setNavbarToogle: any;
};

const Sidebar: React.FC<SidebarProps> = ({ navbarToogle, setNavbarToogle }) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "255px" }}
      className={`min-h-screen w-64 bg-gray-800 text-white flex top-0 bottom-0 flex-col fixed max-md:${
        navbarToogle ? "hidden" : "visible"
      }`}>
      <div
        className="absolute right-2 top-2 border border-white rounded-sm md:hidden"
        onClick={() => {
          setNavbarToogle((prev: boolean) => !prev);
        }}>
        <IoMdClose size={20} />
      </div>

      <div className="flex items-center justify-start px-3 h-20 border-b border-gray-700 gap-2">
        <img
          style={{
            mixBlendMode: "multiply",
          }}
          src="https://images.simpletire.com/image/upload/v1712328147/360-line-images/5305/5305_SaveroHT2_360_2.jpg"
          className="w-14 h-14"
        />
        <h1 className="text-2xl font-semibold">Savero</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul className="text-md">
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaTachometerAlt className="mr-4" />
            <span>Dashboard</span>
          </li>
          {/* <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaEnvelope className="mr-4" />
            <span>Messages</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaUsers className="mr-4" />
            <span>Socials</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaFileAlt className="mr-4" />
            <span>Documents</span>
          </li> */}
        </ul>
        <h2 className="mt-8 mb-4 text-sm text-gray-500">ORDERS</h2>
        <ul className="text-md">
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaTachometerAlt className="mr-4" />
            <span>Orders</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaFileAlt className="mr-4" />
            <span>Track Order</span>
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-sm text-gray-500">PRODUCTS</h2>
        <ul className="text-md">
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaTachometerAlt className="mr-4" />
            <span>Add Product</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaFileAlt className="mr-4" />
            <span>View Produts</span>
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-sm text-gray-500">CATEGORIES</h2>
        <ul className="text-md">
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaTachometerAlt className="mr-4" />
            <span>View Categories</span>
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-sm text-gray-500">CENTER</h2>
        <ul className="text-md">
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaTachometerAlt className="mr-4" />
            <span>Create Center</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaFileAlt className="mr-4" />
            <span>View Centers</span>
          </li>
        </ul>

        <h2 className="mt-8 mb-4 text-sm text-gray-500">SETTINGS</h2>
        <ul>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaCogs className="mr-4" />
            <span>Roles</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaKey className="mr-4" />
            <span>Requests</span>
          </li>
          <li className="mb-1 flex items-center hover:bg-[rgb(43,49,61)] py-3 px-4 rounded-md cursor-pointer">
            <FaExchangeAlt className="mr-4" />
            <span>Preferences</span>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
