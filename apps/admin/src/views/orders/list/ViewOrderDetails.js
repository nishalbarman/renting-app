import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCarousel,
  CCarouselItem,
  CCol,
  CHeader,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

function CenterModal({ visible, setVisible, row }) {
  return (
    <>
      <CModal
        fullscreen={true}
        visible={true}
        onClose={() => {
          setVisible(null)
        }}
        aria-labelledby="FullscreenExample1"
      >
        <CModalHeader>
          <CModalTitle id="FullscreenExample1">View Order</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCard>
                    <CHeader>
                      <strong>{JSON.stringify(row.original)}</strong>
                    </CHeader>
                  </CCard>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CModalBody>
      </CModal>
    </>
  )
}

export default CenterModal
