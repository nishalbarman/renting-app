import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"; // Example icons from React Icons
import { RiFullscreenFill } from "react-icons/ri"; // Example icons from React Icons

type CenterModalProps = {
  visible: boolean;
  viewDocuments: any;
  setViewDocuments: any;
};

function CenterModal({
  visible,
  viewDocuments,
  setViewDocuments,
}: CenterModalProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const docHeader = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null;
    }

    return (
      <>
        <div className="flex items-center justify-end px-3 p-2 border-solid border-gray-300 rounded-t w-full">
          <div className="flex items-center justify-center">
            <FaAngleLeft
              size={25}
              onClick={previousDocument}
              // disabled={state.currentFileNo === 0}
            />
            <FaAngleRight
              size={25}
              onClick={nextDocument}
              // disabled={state.currentFileNo >= state.documents.length - 1}
            />
          </div>
          {/* <RiFullscreenFill
            size={25}
            onClick={() => setFullScreen((prev) => !prev)}
          /> */}
        </div>
      </>
    );
  };

  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-50 w-full h-full flex justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-3 md:p-10 rounded-md">
          <div className="fixed bg-black inset-0 opacity-50"></div>
          <div className="border border-gray-200 shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between px-3 p-2 border-b border-solid border-gray-300 rounded-t w-full">
              <h3 className="text-lg font-semibold">Center Documents</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setViewDocuments(false)}>
                <span className="text-4xl">×</span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <DocViewer
                style={{
                  height: "fit-content",
                  backgroundColor: "transparent",
                  borderRadius: "4px",
                }}
                pluginRenderers={DocViewerRenderers}
                config={{ header: { overrideComponent: docHeader } }}
                documents={viewDocuments}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CenterModal;
