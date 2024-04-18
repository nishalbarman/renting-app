import { CButton, CImage, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductAdd from '../add/ProductAdd'

function CenterModal({ visible, setVisible, fetchProductData }) {
  const [isUpdateLoading, setIsUpdateLoading] = useState(true)

  return (
    <>
      <CModal
        fullscreen={true}
        visible={true}
        onClose={() => {
          sessionStorage.removeItem('productId')
          setVisible(false)
        }}
        aria-labelledby="FullscreenExample1"
      >
        <CModalHeader>
          <CModalTitle id="FullscreenExample1">Update Product</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ProductAdd
            loading={isUpdateLoading}
            setIsUpdateLoading={setIsUpdateLoading}
            fetchProductData={fetchProductData}
            setVisible={setVisible}
          />
        </CModalBody>
      </CModal>
    </>
  )
}

export default CenterModal
