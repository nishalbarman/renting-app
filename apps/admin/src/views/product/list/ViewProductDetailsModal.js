import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCarousel,
  CCarouselItem,
  CCol,
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
        visible={true}
        onClose={() => {
          setVisible(null)
        }}
        aria-labelledby="FullscreenExample1"
      >
        <CModalHeader>
          <CModalTitle id="FullscreenExample1">View Product</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCarousel controls indicators dark>
                    {row.original.slideImages?.map((imageUrl, index) => (
                      <CCarouselItem key={index}>
                        <CImage
                          style={{
                            height: '400px',
                            width: '400px',
                            objectFit: 'contain',
                            objectPosition: 'center',
                          }}
                          src={imageUrl}
                          alt={`Slide ${index + 1}`}
                        />
                      </CCarouselItem>
                    ))}
                  </CCarousel>

                  <div
                    style={{
                      marginBottom: '15px',
                    }}
                  >
                    <h4>{row.original.title}</h4>
                  </div>
                  <h5>
                    <b>Description</b>
                  </h5>
                  <div dangerouslySetInnerHTML={{ __html: row.original.description }}></div>

                  {row.original.isVariantAvailable && (
                    <>
                      <div
                        style={{
                          marginBottom: '15px',
                        }}
                      >
                        <h5>
                          <b>Variants</b>
                        </h5>
                      </div>

                      <CRow>
                        {row.original.productVariant.map((item) => (
                          <CCol>
                            <CCard>
                              <CCardBody>
                                <CCarousel controls indicators dark>
                                  {item.slideImages.map((image) => {
                                    return (
                                      <CCarouselItem
                                        style={{
                                          width: '100%',
                                        }}
                                      >
                                        <CImage
                                          style={{
                                            width: '400px',
                                            height: '400px',
                                            objectFit: 'contain',
                                            objectPosition: 'center',
                                          }}
                                          src={image}
                                        />
                                      </CCarouselItem>
                                    )
                                  })}
                                </CCarousel>

                                <p>Renting Price: {row.original.rentingPrice}</p>
                                <p>Discounted Price: {row.original.discountedPrice}</p>
                                <p>Original Price: {row.original.originalPrice}</p>
                                <p>Shipping Price: {row.original.shippingPrice}</p>
                                <p>Available Stocks: {row.original.availableStocks}</p>
                              </CCardBody>
                            </CCard>
                          </CCol>
                        ))}
                      </CRow>
                    </>
                  )}
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
