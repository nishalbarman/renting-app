import { CButton, CImage, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { pdfjs } from 'react-pdf'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function CenterModal({ visible, viewDocuments, setViewDocuments }) {
  const [fullScreen, setFullScreen] = useState(false)

  const docHeader = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null
    }

    return (
      <>
        {/* <div>{state.currentDocument.uri || ''}</div> */}
        <div
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',

            marginBottom: '20px',
          }}
        >
          <CButton
            style={{
              color: 'white',
            }}
            color="primary"
            onClick={previousDocument}
            disabled={state.currentFileNo === 0}
          >
            Previous Document
          </CButton>

          <CButton
            style={{
              color: 'white',
            }}
            color="primary"
            onClick={nextDocument}
            disabled={state.currentFileNo >= state.documents.length - 1}
          >
            Next Document
          </CButton>
          <CButton
            style={{
              color: 'white',
            }}
            color="primary"
            onClick={() => {
              setFullScreen((prev) => !prev)
            }}
          >
            Full Screen
          </CButton>
        </div>
      </>
    )
  }

  return (
    <>
      <CModal
        fullscreen={fullScreen}
        visible={visible}
        onClose={() => setViewDocuments(false)}
        aria-labelledby="FullscreenExample1"
      >
        <CModalHeader>
          <CModalTitle id="FullscreenExample1">Center Documents</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DocViewer
            style={{
              height: 'fit-content',
              backgroundColor: 'transparent',
              borderRadius: '4px',
            }}
            pluginRenderers={DocViewerRenderers}
            config={{
              header: {
                overrideComponent: docHeader,
              },
            }}
            documents={viewDocuments}
          />
        </CModalBody>
      </CModal>
    </>
  )
}

export default CenterModal
