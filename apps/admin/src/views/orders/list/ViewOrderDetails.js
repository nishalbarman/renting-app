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
        scrollable
        backdrop="static"
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
                            width: '100%',
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

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              {order.orderStatus === 'On Progress' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0ffff',
                                    border: '1px solid #2AAABF',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#2AAABF',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    On Progress
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'Accepted' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f5fff6',
                                    border: '1px solid #79E7A8',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#36664c',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Accepted
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'Delivered' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0e6ff',
                                    border: '1px solid #754db0',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#754db0',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Delivered
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'On Hold' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff6c7',
                                    border: '1px solid #ebb434',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#7a5c14',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    On Hold
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'Cancelled' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f7eae9',
                                    border: '1px solid #db3125',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#a11b12',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Cancelled
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'On The Way' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#b1ebf0',
                                    border: '1px solid #2e7e85',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#2e7e85',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    On The Way
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'PickUp Ready' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0e6ff',
                                    border: '1px solid #754db0',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#754db0',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    PickUp Ready
                                  </span>
                                </div>
                              )}
                              {order.orderStatus === 'Pending' && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0ffff',
                                    border: '1px solid #2AAABF',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#2AAABF',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    Pending
                                  </span>
                                </div>
                              )}
                              {order.orderStatus !== 'On Progress' &&
                                order.orderStatus !== 'Accepted' &&
                                order.orderStatus !== 'Delivered' &&
                                order.orderStatus !== 'On Hold' &&
                                order.orderStatus !== 'Cancelled' &&
                                order.orderStatus !== 'On The Way' &&
                                order.orderStatus !== 'PickUp Ready' &&
                                order.orderStatus !== 'Pending' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f7eae9',
                                      border: '1px solid #db3125',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: '#a11b12',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Rejected
                                    </span>
                                  </div>
                                )}
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
                                      fontSize: '16px',
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
                                      fontSize: '16px',
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
                                      fontSize: '16px',
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
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    {row.original.orderType === 'rent' && (
                      <div
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        * This is a rent order, so collect cash upon pickup.
                      </div>
                    )}

                    {row.original.orderType === 'buy' && (
                      <div
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        * This is a buy order, so make sure that payment has been received before
                        proceeding.
                      </div>
                    )}

                    <div
                      style={{
                        height: '1px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        width: '100%',
                      }}
                    ></div>

                    <div className="mt-2">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Subtotal ({row.original.totalDocumentCount} items)</span>
                        <span>₹{summary.subTotalPrice}</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Delivery</span>
                        <span>₹{summary.shippingPrice}</span>
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

                      {row.original.orderType === 'buy' && (
                        <>
                          <div
                            style={{
                              height: '1px',
                              marginTop: '10px',
                              marginBottom: '10px',
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              width: '100%',
                            }}
                          ></div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <b>Payment Status</b>
                            <div
                              style={{
                                color: 'black',
                                borderRadius: '7px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  paddingBottom: '2px',
                                  paddingLeft: '2px',
                                }}
                              >
                                {summary.paymentStatus === 'Pending' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f0ffff',
                                      border: '1px solid #2AAABF',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: '#2AAABF',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Pending
                                    </span>
                                  </div>
                                )}
                                {summary.paymentStatus === 'Paid' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f5fff6',
                                      border: '1px solid #79E7A8',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: '#36664c',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Paid
                                    </span>
                                  </div>
                                )}
                                {summary.paymentStatus === 'Failed' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      backgroundColor: '#f0e6ff',
                                      border: '1px solid #754db0',
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: '#754db0',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Failed
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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
