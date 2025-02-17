import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCarousel,
  CCarouselItem,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
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
import { useSearchParams } from 'react-router-dom'

const statusStyles = {
  OnProgress: {
    backgroundColor: '#f0ffff',
    border: '1px solid #2AAABF',
    color: '#2AAABF',
  },
  Accepted: {
    backgroundColor: '#f5fff6',
    border: '1px solid #79E7A8',
    color: '#36664c',
  },
  Delivered: {
    backgroundColor: '#f0e6ff',
    border: '1px solid #754db0',
    color: '#754db0',
  },
  OnHold: {
    backgroundColor: '#fff6c7',
    border: '1px solid #ebb434',
    color: '#7a5c14',
  },
  Cancelled: {
    backgroundColor: '#f7eae9',
    border: '1px solid #db3125',
    color: '#a11b12',
  },
  OnTheWay: {
    backgroundColor: '#b1ebf0',
    border: '1px solid #2e7e85',
    color: '#2e7e85',
  },
  PickUpReady: {
    backgroundColor: '#f0e6ff',
    border: '1px solid #754db0',
    color: '#754db0',
  },
  Pending: {
    backgroundColor: '#f0ffff',
    border: '1px solid #2AAABF',
    color: '#2AAABF',
  },
  Rejected: {
    backgroundColor: '#f7eae9',
    border: '1px solid #db3125',
    color: '#a11b12',
  },
}

const OrderStatus = ({ status }) => {
  const style = statusStyles[status.replace(/\s+/g, '')] || statusStyles.Rejected

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: '3px 7px',
        borderRadius: '4px',
        backgroundColor: style.backgroundColor,
        border: style.border,
      }}
    >
      <span
        style={{
          color: style.color,
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {status}
      </span>
    </div>
  )
}

function ViewSingleOrder() {
  const { jwtToken } = useSelector((state) => state.auth)

  const [searchParams, setSearchParams] = useSearchParams()
  const [groupOrderId, setGroupOrderId] = useState()

  const [isLoading, setIsOrderLoading] = useState()

  useEffect(() => {
    if (!!searchParams.get('groupId')) setGroupOrderId(searchParams.get('groupId'))
  }, [searchParams])

  const [isGroupOrderFetching, setIsGroupOrderFetching] = useState(true)
  const [groupOrderDetails, setGroupOrderDetails] = useState({})

  const fetchGroupOrderDetails = async () => {
    try {
      if (!groupOrderId) return
      setIsGroupOrderFetching(true)
      const response = await axios.get(
        `${process.env.VITE_APP_API_URL}/orders/details/${groupOrderId}`,
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
      setIsOrderLoading(false)
    }
  }

  useEffect(() => {
    fetchGroupOrderDetails()
  }, [groupOrderId])

  const [summary, setSummary] = useState({})

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        if (!groupOrderId) return
        const response = await axios.get(
          `${process.env.VITE_APP_API_URL}/payment/summary/${groupOrderId}`,
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
      } finally {
        setIsOrderLoading(false)
      }
    }

    fetchPaymentSummary()
  }, [groupOrderId])

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
          order: groupOrderId,
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
      <CContainer>
        <div>
          {!searchParams.get('groupId') && (
            <CCard>
              <CCardBody>
                <CForm
                  onSubmit={(e) => {
                    e.preventDefault()
                    setGroupOrderId(e.target.groupId.value.trim())
                  }}
                >
                  <CFormLabel htmlFor="groupId">Order Group ID</CFormLabel>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      marginTop: '-10px',
                    }}
                  >
                    <CFormInput id="groupId" type="text" placeholder="Order Group Id" />
                    <CButton
                      type="submit"
                      style={{
                        margin: '10px 0px',
                        float: 'right',
                      }}
                      color="info"
                    >
                      Search
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          )}
        </div>

        <div>
          {isGroupOrderFetching ? (
            <CSpinner />
          ) : (
            <>
              {!!Object.keys(groupOrderDetails).length && !!Object.keys(summary).length ? (
                <>
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
                      fontSize: '20px',
                      margin: '10px 0px',
                    }}
                  >
                    <span>GroupID </span>#<strong>{groupOrderId}</strong>
                  </div>

                  <CCard>
                    <CCardBody>
                      <CRow sm={{ cols: 1 }} xs={{ cols: 1 }} lg={{ cols: 2 }}>
                        <CCol>
                          {/* <CCard style={{
                            height: '100%'
                          }}>
                            <CCardHeader>
                              <strong>Order Details</strong>
                            </CCardHeader> */}
                            {/* <CCardBody> */}
                              <CRow>
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
                                          <OrderStatus status={order.orderStatus} />
                                        </div>
                                      </CCardHeader>

                                      <CCardBody>
                                        <CRow>
                                          {/* <CAlert color="warning">
                                  <div>
                                    <div>
                                      <strong>Order #{order._id}</strong>
                                    </div>
                                    <div>{order.orderStatus}</div>
                                  </div>
                                </CAlert> */}

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
                                                // border: '1px solid gray',
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
                                                  WebkitLineClamp: 3,
                                                  overflow: 'hidden',
                                                }}
                                              >
                                                <strong>{order.title}</strong>
                                              </div>
                                              <div
                                                style={{
                                                  margin: '5px 0px',
                                                }}
                                              >
                                                <div>
                                                  Qty: <b>{order.quantity || '1'}</b>
                                                </div>

                                                <div>
                                                  Color: <b>{order.color || 'Black'}</b>
                                                </div>
                                                <div>
                                                  Size: <b>{order.size || 'S'}</b>
                                                </div>

                                                {order.orderType == 'rent' && (
                                                  <div>
                                                    Renting Days: <b>{order.rentDays || '1'}</b>
                                                  </div>
                                                )}
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
                                            </div>
                                          </div>
                                        </CRow>
                                      </CCardBody>
                                    </CCard>
                                  </CCol>
                                ))}
                              </CRow>
                            {/* </CCardBody> */}
                          {/* </CCard> */}
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
                                  <CIcon icon={cilUser} />
                                  <span
                                    style={{
                                      marginLeft: '5px',
                                    }}
                                  >
                                    {groupOrderDetails?.user?.name}
                                  </span>
                                </div>
                                <div>
                                  <CIcon icon={cilPhone} />
                                  <span
                                    style={{
                                      marginLeft: '5px',
                                    }}
                                  >
                                    {groupOrderDetails?.user?.email}
                                  </span>
                                </div>
                                <div>
                                  <CIcon icon={cilPhone} />
                                  <span
                                    style={{
                                      marginLeft: '5px',
                                    }}
                                  >
                                    {groupOrderDetails?.user?.mobileNo}
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
                                    <CAlert className="mt-2" color="warning">
                                      <div>
                                        <div>
                                          <p>
                                            Full Address:{' '}
                                            <span
                                              style={{
                                                fontWeight: 'bold',
                                              }}
                                            >{`${groupOrderDetails?.address?.address.prefix}, ${groupOrderDetails?.address?.address.streetName}, ${groupOrderDetails?.address?.address.locality}, ${groupOrderDetails?.address?.address.postalCode}, ${groupOrderDetails?.address?.address.country}`}</span>
                                          </p>
                                          <p>
                                            Road: {groupOrderDetails?.address?.address.streetName}
                                          </p>
                                          <p>
                                            Postal Code:{' '}
                                            {groupOrderDetails?.address?.address.postalCode}
                                          </p>
                                          <p>City: {groupOrderDetails?.address?.address.city}</p>
                                          <p>State: {groupOrderDetails?.address?.address.state}</p>
                                        </div>
                                        <b>
                                          <span>
                                            Longitude : {groupOrderDetails.address?.location[0]}
                                          </span>
                                          {', '}
                                          <span>
                                            Latitude : {groupOrderDetails.address?.location[1]}
                                          </span>
                                        </b>
                                      </div>
                                    </CAlert>
                                  </div>
                                </>
                              )}
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
                                  <CAlert color="danger">
                                    <div>This is a rent order, so collect cash upon pickup.</div>
                                  </CAlert>
                                )}

                                {groupOrderDetails.orderType === 'buy' && (
                                  <CAlert color="success">
                                    <div>
                                      This is a buy order, so make sure that payment has been
                                      received before proceeding.
                                    </div>
                                  </CAlert>
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
                                    <span>
                                      Subtotal ({groupOrderDetails.totalDocumentCount} items)
                                    </span>
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
                                                  padding: '3px 7px',
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
                                                  padding: '3px 7px',
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
                                                  padding: '3px 7px',
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
                                <CAlert color="success">
                                  <div>
                                    This is a buy order, so make sure that payment has been received
                                    before proceeding.
                                  </div>
                                </CAlert>
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
                    </CCardBody>
                  </CCard>
                </>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  No group Id provided
                </div>
              )}
            </>
          )}
        </div>
      </CContainer>
    </>
  )
}

export default ViewSingleOrder
