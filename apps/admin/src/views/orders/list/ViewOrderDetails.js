import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCarousel,
  CCarouselItem,
  CCol,
  CFormInput,
  CFormSelect,
  CHeader,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
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

  const [isGroupOrderFetching, setIsGroupOrderFetching] = useState(true)
  const [groupOrderDetails, setGroupOrderDetails] = useState({})

  const fetchGroupOrderDetails = async () => {
    try {
      setIsGroupOrderFetching(true)
      const response = await axios.get(
        `${process.env.VITE_APP_API_URL}/orders/details/${row.original.orderGroupID}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )
      setGroupOrderDetails(response.data)
    } catch (error) {
      toast.error(error.response?.message || error.message)
      console.error(error)
    } finally {
      setIsGroupOrderFetching(false)
    }
  }

  useEffect(() => {
    fetchGroupOrderDetails()
  }, [])

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

  const [orderUpdatableStatus, setOrderUpdatableStatus] = useState('')
  const [groupTrackingLink, setGroupTrackingLink] = useState('')

  const handleUpdateOrderStatus = async () => {
    if (!orderUpdatableStatus) return toast.info('Order status not selected')
    const toastId = toast.loading('Please wait.. sending your request..')
    try {
      if (orderUpdatableStatus === 'On The Way' && !groupTrackingLink)
        return toast.update(toastId, {
          render: 'Fill the order tracking link',
          type: 'info',
          isLoading: false,
          autoClose: 5000,
        })

      const response = await axios.patch(
        `${process.env.VITE_APP_API_URL}/orders/update-status`,
        {
          order: row.original.orderGroupID,
          orderStatus: orderUpdatableStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      )

      await fetchGroupOrderDetails()
      toast.update(toastId, {
        render: response.data.message || 'Order status updated',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      })
    } catch (error) {
      toast.update(toastId, {
        render: error.data.message || 'Order status updation failed',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })

      console.error(error)
    }
  }

  return (
    <>
      <CModal
        scrollable
        backdrop="static"
        fullscreen={false}
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
          {isGroupOrderFetching ? (
            <CSpinner />
          ) : (
            <CRow sm={{ cols: 1 }} xs={{ cols: 1 }} lg={{ cols: 1 }}>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <strong>Order Details</strong>
                  </CCardHeader>
                  <CCardBody>
                    <CRow
                    // style={{
                    //   backgroundColor: 'white',
                    // }}
                    >
                      {groupOrderDetails.orders?.map((order) => (
                        <CCol xs={{ gutterX: 0, gutterY: 0 }}>
                          <CCard
                            style={{
                              backgroundColor: 'white',
                              width: '100%',
                            }}
                          >
                            {order.orderStatus === 'Cancelled' && (
                              <div
                                style={{
                                  position: 'absolute',
                                  height: '100%',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(2px)',
                                  background: 'rgba(0,0,0,0.1)',
                                }}
                              >
                                <strong
                                  style={{
                                    rotate: '-18deg',
                                    color: 'red',
                                    fontWeight: 'bolder',
                                    fontSize: '18px',
                                    textShadow: '0px 0px 3px white',
                                    textAlign: 'center',
                                  }}
                                >
                                  Order Cancelled By User, Do not fullfill this order
                                </strong>
                              </div>
                            )}
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

                <div>
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
                      {groupOrderDetails.orderType === 'rent' && (
                        <div
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          * This is a rent order, so collect cash upon pickup.
                        </div>
                      )}

                      {groupOrderDetails.orderType === 'buy' && (
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
                          <span>Subtotal ({groupOrderDetails.totalDocumentCount} items)</span>
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

                        {groupOrderDetails.orderType === 'buy' && (
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
              <CCol xs={{ gutterX: 10, gutterY: 10 }}>
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
                        {groupOrderDetails.user.name}
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
                        {groupOrderDetails.totalDocumentCount} Order(s)
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
                          {groupOrderDetails.user.email}
                        </span>
                      </div>
                      <div>
                        <CIcon icon={cilPhone} />
                        <span
                          style={{
                            marginLeft: '5px',
                          }}
                        >
                          {groupOrderDetails.user.mobileNo}
                        </span>
                      </div>
                    </div>

                    {!!groupOrderDetails.address && (
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
                            <div>
                              <p>
                                Full Address:{' '}
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >{`${groupOrderDetails?.address?.address.prefix}, ${groupOrderDetails?.address?.address.streetName}, ${groupOrderDetails?.address?.address.locality}, ${groupOrderDetails?.address?.address.postalCode}, ${groupOrderDetails?.address?.address.country}`}</span>
                              </p>
                              <p>Road: {groupOrderDetails?.address?.address.streetName}</p>
                              <p>Postal Code: {groupOrderDetails?.address?.address.postalCode}</p>
                              <p>City: {groupOrderDetails?.address?.address.city}</p>
                              <p>State: {groupOrderDetails?.address?.address.state}</p>
                            </div>
                            <span>Longitude : {groupOrderDetails.address.location[0]}</span>
                            {', '}
                            <span>Latitude : {groupOrderDetails.address.location[1]}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CCardBody>
                </CCard>

                <CCard>
                  <CCardHeader
                    style={{
                      backgroundColor: 'white',
                      width: '100%',
                    }}
                  >
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        src="https://st5.depositphotos.com/4226061/62815/v/450/depositphotos_628157962-stock-illustration-invoice-icon-payment-bill-invoice.jpg"
                      />
                      <strong>Update Status</strong>
                    </div>
                  </CCardHeader>
                  <CCardBody>
                    {groupOrderDetails.orderType === 'rent' && (
                      <div
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        * This is a rent order, so collect cash upon pickup.
                      </div>
                    )}

                    {groupOrderDetails.orderType === 'buy' && (
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
                    <div className="mt-2">
                      <strong>Update status of the order</strong>
                      <div className="mt-2">
                        <CFormSelect
                          onChange={(e) => {
                            setOrderUpdatableStatus(e.target.value)
                          }}
                        >
                          <option value={''}>Select Status</option>
                          {groupOrderDetails.orderType === 'rent' && (
                            <option value={'On Progress'}>On Progress</option>
                          )}
                          <option value={'Accepted'}>Accept</option>
                          <option value={'Rejected'}>Reject</option>
                          {/* <option value={'Cancelled'}>Cancel</option> */}

                          <option value={'On The Way'}>On The Way</option>

                          {groupOrderDetails.orderType === 'buy' && (
                            <option value={'Delivered'}>Delivered</option>
                          )}

                          {groupOrderDetails.orderType === 'rent' && (
                            <option value={'PickUp Ready'}>PickUp Ready</option>
                          )}
                        </CFormSelect>

                        {orderUpdatableStatus === 'On The Way' && (
                          <>
                            <div style={{ marginTop: '10px' }}>
                              <b>Tracking Link</b>
                            </div>
                            <CFormInput
                              className="mt-1"
                              type="url"
                              placeholder="https://example.com/id-13"
                              value={groupTrackingLink}
                              onChange={(e) => {
                                setGroupTrackingLink(e.target.value)
                              }}
                            />
                          </>
                        )}

                        <CButton
                          onClick={handleUpdateOrderStatus}
                          style={{
                            width: '100%',
                            marginTop: '15px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                          color="success"
                        >
                          UPDATE
                        </CButton>
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default CenterModal
