import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"; // Example icons from React Icons
import { RiFullscreenFill } from "react-icons/ri"; // Example icons from React Icons
import ProductAdd from "./ProductAdd";

type CenterModalProps = {
  visible: boolean;
  setVisible: any;
  fetchProductData: any;
};

function CenterModal({
  visible,
  setVisible,
  fetchProductData,
}: CenterModalProps) {
  const [isUpdateLoading, setIsUpdateLoading] = useState(true);

  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-50 w-full h-full flex justify-center overflow-x-hidden overflow-y-hidden outline-none focus:outline-none p-3 md:p-10 rounded-md">
          <div className="fixed bg-black inset-0 opacity-50"></div>
          <div className="border border-gray-200 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between px-3 p-2 border-b border-solid border-gray-300 rounded-t w-full">
              <h3 className="text-lg font-semibold">Update Product</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  sessionStorage.removeItem("productId");
                  setVisible(false);
                }}>
                <span className="text-4xl">×</span>
              </button>
            </div>
            <div className="relative p-6 flex-auto overflow-auto">
              <ProductAdd
                loading={isUpdateLoading}
                setIsUpdateLoading={setIsUpdateLoading}
                fetchProductData={fetchProductData}
                setVisible={setVisible}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CenterModal;
