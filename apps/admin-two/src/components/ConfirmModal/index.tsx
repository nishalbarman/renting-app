import React, { useState } from "react";

type ConfirmModalProps = {
  children: React.ReactNode;
  title: String;
  closeModal: any;
};

function index({ children, title, closeModal }: ConfirmModalProps) {
  return (
    <>
      <div className={`fixed inset-0 flex z-50 justify-center md:items-center w-full p-2`}>
        <div className="fixed bg-black inset-0 opacity-50"></div>
        <div className="bg-white rounded-lg p-4 shadow-lg z-50 w-full lg:w-[45%] h-fit">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Are you sure about that?</h3>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </>
  );
}

export default index;
