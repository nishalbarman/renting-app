import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
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
import CIcon from '@coreui/icons-react'
import { cilPhone, cilUser } from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { CardHeader } from '@mui/material'

function CenterModal({ visible, setVisible, row }) {
  const { jwtToken } = useSelector((state) => state.auth)
  console.log(row)

  const [summary, setSummary] = useState({})

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        const response = await axios.get(
          `${process.env.VITE_APP_API_URL}/payment/summary/${row.original.orderGroupID}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        )
        setSummary(response.data)
      } catch (error) {
        toast.error(error.response?.message || error.message)
        console.error(error)
      }
    }

    fetchPaymentSummary()
  }, [row])

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
          <CModalTitle id="FullscreenExample1">
            Group #<strong>{row.original.orderGroupID}</strong>
          </CModalTitle>
        </CModalHeader>
        <CModalBody
          style={{
            backgroundColor: 'rgb(245,248,253)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CRow
            sm={{ cols: 1 }}
            xs={{ gutterX: 10, gutterY: 10, cols: 1 }}
            lg={{ gutterX: 10, gutterY: 10, cols: 2 }}
          >
            <CCol xs={{ gutterY: 10 }}>
              <CCard>
                <CCardHeader>
                  <strong>Order Details</strong>
                </CCardHeader>
                <CCardBody>
                  <CRow
                    style={{
                      backgroundColor: 'white',
                    }}
                  >
                    {row.original.orders?.map((order) => (
                      <CCol>
                        <CCard
                          style={{
                            backgroundColor: 'white',
                          }}
                        >
                          <CCardHeader
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: 'white',
                            }}
                          >
                            <div>
                              <span className="text-[gray]">Order #</span>
                              <span>{order._id}</span>
                            </div>

                            <div>
                              <span
                                style={{
                                  backgroundColor: 'orange',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  color: 'white',
                                  fontSize: '15px',
                                }}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                          </CCardHeader>

                          <CCardBody>
                            <CRow>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '15px',
                                }}
                              >
                                <CCardImage
                                  style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '7px',
                                    border: '1px solid gray',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                  src={order.previewImage}
                                />
                                <div>
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      WebkitBoxOrient: 'vertical',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 1,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <strong>{order.title}</strong>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      margin: '10px 0px',
                                    }}
                                  >
                                    <strong>{`₹${order.price}`}</strong>{' '}
                                    {order.orderType === 'rent'
                                      ? `(Renting price)`
                                      : `(Buying price)`}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      margin: '10px 0px',
                                    }}
                                  >
                                    <strong>
                                      {order.orderType === 'rent'
                                        ? `₹${order.shippingPrice}`
                                        : `₹${0}`}{' '}
                                    </strong>
                                    (Shipping/-)
                                  </div>
                                  <div>
                                    {order.orderType == 'rent' && (
                                      <div>
                                        Renting Days: <b>{order.rentDays || '1'}</b>
                                      </div>
                                    )}

                                    <div>
                                      Qty: <b>{order.quantity || '1'}</b>
                                    </div>

                                    <div>
                                      Color: <b>{order.color || 'Black'}</b>
                                    </div>
                                    <div>
                                      Size: <b>{order.size || 'S'}</b>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CRow>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    ))}
                  </CRow>
                </CCardBody>
              </CCard>

              <div className="mt-2">
                <CCard>
                  <CCardHeader>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <strong>Payment Summary</strong>
                      {row.original.orderType === 'buy' && (
                        <div
                          style={{
                            padding: '5px 10px',
                            backgroundColor: 'lightgreen',
                            color: 'black',
                            border: '1px solid green',
                            fontWeight: 'semibold',
                            borderRadius: '7px',
                          }}
                        >
                          {summary.paymentStatus || 'Failed'}
                        </div>
                      )}
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    <div className="mt-2">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Subtotal ({row.original.totalDocumentCount} items)</span>
                        <b>₹{summary.subTotalPrice}</b>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Delivery</span>
                        <b>₹{summary.shippingPrice}</b>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Total</span>
                        <b>₹{summary.totalPrice}</b>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </CCol>
            <CCol>
              <CCard>
                <CCardHeader
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                  }}
                >
                  <div>
                    <strong>Customer</strong>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '10px',
                    }}
                  >
                    <CImage
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '100%',
                        border: '1px solid black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
                    />
                    <span
                      className="ml-2"
                      style={{
                        marginLeft: '6px',
                      }}
                    >
                      {row.original.user.name}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '1px',
                      marginTop: '10px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      width: '100%',
                    }}
                  ></div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '10px',
                    }}
                  >
                    <CImage
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '100%',
                        border: '1px solid black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      src="https://st5.depositphotos.com/4226061/62815/v/450/depositphotos_628157962-stock-illustration-invoice-icon-payment-bill-invoice.jpg"
                    />
                    <span
                      className="ml-2"
                      style={{
                        marginLeft: '6px',
                      }}
                    >
                      {row.original.totalDocumentCount} Order(s)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '1px',
                      marginTop: '10px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      width: '100%',
                    }}
                  ></div>
                  <div className="mt-2">
                    <strong>Contact info</strong>
                    <div className="mt-2">
                      <CIcon icon={cilPhone} />
                      <span
                        style={{
                          marginLeft: '5px',
                        }}
                      >
                        {row.original.user.email}
                      </span>
                    </div>
                    <div>
                      <CIcon icon={cilPhone} />
                      <span
                        style={{
                          marginLeft: '5px',
                        }}
                      >
                        {row.original.user.mobileNo}
                      </span>
                    </div>
                  </div>

                  {!!row.original.address && (
                    <>
                      <div
                        style={{
                          height: '1px',
                          marginTop: '10px',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          width: '100%',
                        }}
                      ></div>
                      <div className="mt-2">
                        <strong>Delivery Address</strong>
                        <div className="mt-2">
                          <div>{row.original.address.address}</div>
                          <span>Longitude : {row.original.address.location[0]}</span>
                          {', '}
                          <span>Latitude : {row.original.address.location[1]}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

export default CenterModal
