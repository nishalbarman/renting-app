import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@store/rtk";
import { OrderGroup, PaymentSummary } from "../../types";

type StatusStyleValue = {
  backgroundColor: string;
  border: string;
  color: string;
};

const statusStyles: { [key: string]: StatusStyleValue } = {
  OnProgress: {
    backgroundColor: "#f0ffff",
    border: "1px solid #2AAABF",
    color: "#2AAABF",
  },
  Accepted: {
    backgroundColor: "#f5fff6",
    border: "1px solid #79E7A8",
    color: "#36664c",
  },
  Delivered: {
    backgroundColor: "#f0e6ff",
    border: "1px solid #754db0",
    color: "#754db0",
  },
  OnHold: {
    backgroundColor: "#fff6c7",
    border: "1px solid #ebb434",
    color: "#7a5c14",
  },
  Cancelled: {
    backgroundColor: "#f7eae9",
    border: "1px solid #db3125",
    color: "#a11b12",
  },
  OnTheWay: {
    backgroundColor: "#b1ebf0",
    border: "1px solid #2e7e85",
    color: "#2e7e85",
  },
  PickUpReady: {
    backgroundColor: "#f0e6ff",
    border: "1px solid #754db0",
    color: "#754db0",
  },
  Pending: {
    backgroundColor: "#f0ffff",
    border: "1px solid #2AAABF",
    color: "#2AAABF",
  },
  Rejected: {
    backgroundColor: "#f7eae9",
    border: "1px solid #db3125",
    color: "#a11b12",
  },
};

interface OrderStatusProps {
  status: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const style: StatusStyleValue =
    statusStyles[status.replace(/\s+/g, "")] || statusStyles.Rejected;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "3px 7px",
        borderRadius: "4px",
        backgroundColor: style.backgroundColor,
        border: style.border,
      }}>
      <span
        style={{
          color: style.color,
          fontSize: "16px",
          fontWeight: "bold",
        }}>
        {status}
      </span>
    </div>
  );
};

function ViewSingleOrder() {
  const { jwtToken } = useAppSelector((state) => state.auth);

  const [searchParams] = useSearchParams();
  const [groupOrderId, setGroupOrderId] = useState<string | null>();

  const [isLoading, setIsOrderLoading] = useState(true);

  console.log(isLoading);

  useEffect(() => {
    if (!!searchParams.get("groupId"))
      setGroupOrderId(searchParams.get("groupId"));
  }, [searchParams]);

  const [isGroupOrderFetching, setIsGroupOrderFetching] = useState(true);
  const [groupOrderDetails, setGroupOrderDetails] = useState<OrderGroup>();

  const fetchGroupOrderDetails = async () => {
    try {
      if (!groupOrderId) return;
      setIsGroupOrderFetching(true);
      const response = await axios.get(
        `${process.env.VITE_APP_API_URL}/orders/details/${groupOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setGroupOrderDetails(response.data);
    } catch (error: any) {
      toast.error(error.response?.message || error.message);
      console.error(error);
    } finally {
      setIsGroupOrderFetching(false);
      setIsOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupOrderDetails();
  }, [groupOrderId]);

  const [summary, setSummary] = useState<PaymentSummary | undefined>();

  console.log(summary);

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        if (!groupOrderId) return;
        const response = await axios.get(
          `${process.env.VITE_APP_API_URL}/payment/summary/${groupOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setSummary(response.data);
      } catch (error: any) {
        toast.error(error.response?.message || error.message);
        console.error(error);
      } finally {
        setIsOrderLoading(false);
      }
    };

    fetchPaymentSummary();
  }, [groupOrderId]);

  const [orderUpdatableStatus, setOrderUpdatableStatus] = useState("");
  const [groupTrackingLink, setGroupTrackingLink] = useState("");

  const handleUpdateOrderStatus = async () => {
    if (!orderUpdatableStatus) return toast.info("Order status not selected");
    const toastId = toast.loading("Please wait.. sending your request..");
    try {
      if (orderUpdatableStatus === "On The Way" && !groupTrackingLink)
        return toast.update(toastId, {
          render: "Fill the order tracking link",
          type: "info",
          isLoading: false,
          autoClose: 5000,
        });

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
        }
      );

      await fetchGroupOrderDetails();
      toast.update(toastId, {
        render: response.data.message || "Order status updated",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error.data.message || "Order status updation failed",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });

      console.error(error);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 bg-gray-100 ml-64 max-md:ml-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Track Order</h1>
        {/* <div>
          <input
            type="text"
            placeholder="Type anywhere to search"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div> */}
      </div>
      <div>
        {!searchParams.get("groupId") && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form
              onSubmit={(e: BaseSyntheticEvent) => {
                e.preventDefault();
                setGroupOrderId(e.target.groupId.value.trim());
              }}>
              <label htmlFor="groupId" className="block font-bold mb-2">
                Order Group ID
              </label>
              <div className="flex justify-center items-center mb-4">
                <input
                  id="groupId"
                  type="text"
                  placeholder="Order Group Id"
                  className="border border-gray-300 rounded-l-md px-4 py-2 w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div>
        {isGroupOrderFetching ||
        groupOrderDetails === undefined ||
        summary === undefined ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {!!Object.keys(groupOrderDetails).length &&
            !!Object.keys(summary).length ? (
              <>
                <div className="h-px bg-gray-300 my-4"></div>
                <div className="text-lg mb-4">
                  <span>GroupID </span>#<strong>{groupOrderId}</strong>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div>
                      <div className="grid grid-cols-1 gap-4">
                        {groupOrderDetails.orders?.map((order) => (
                          <div
                            key={order._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden relative border">
                            {order.orderStatus === "Cancelled" && (
                              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-10">
                                <strong className="text-red-500 font-bold text-lg transform rotate-[-18deg] text-center text-shadow">
                                  Order Cancelled By User, Do not fullfill this
                                  order
                                </strong>
                              </div>
                            )}
                            <div className="bg-white px-4 py-3 flex justify-between items-center border border-t">
                              <div>
                                <span className="text-gray-500">Order #</span>
                                <span>{order._id}</span>
                              </div>
                              <div className="flex flex-col justify-between">
                                <OrderStatus status={order.orderStatus} />
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex gap-4">
                                <img
                                  src={order.previewImage}
                                  alt={order.title}
                                  className="w-40 h-40 object-cover rounded-md"
                                />
                                <div>
                                  <div className="font-bold line-clamp-3">
                                    {order.title}
                                  </div>
                                  <div className="mt-2">
                                    <div>
                                      Qty: <b>{order.quantity || "1"}</b>
                                    </div>
                                    <div>
                                      Color: <b>{order.color || "Black"}</b>
                                    </div>
                                    <div>
                                      Size: <b>{order.size || "S"}</b>
                                    </div>
                                    {order.orderType === "rent" && (
                                      <div>
                                        Renting Days:{" "}
                                        <b>{order.rentDays || "1"}</b>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-lg mt-4">
                                    Price:{" "}
                                    <span className="font-bold">
                                      ₹{order.price}{" "}
                                      {order.orderType === "rent" && ` / Day`}
                                    </span>
                                  </div>
                                  <div className="text-lg mt-2">
                                    Delivery Charge:{" "}
                                    <span className="font-bold">
                                      {order.orderType === "buy"
                                        ? `₹ {order.shippingPrice}`
                                        : "Not Applicable"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="bg-white rounded-lg shadow-md mb-6 border">
                        <div className="bg-white p-4">
                          <div>
                            <strong>Customer</strong>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src="https://st5.depositphotos.com/4226061/62815/v/450/depositphotos_628157962-stock-illustration-invoice-icon-payment-bill-invoice.jpg"
                              alt="Customer"
                              className="w-10 h-10 rounded-full border border-black object-cover"
                            />
                            <span>
                              {groupOrderDetails.totalDocumentCount} Order(s)
                            </span>
                          </div>
                          <div className="h-px bg-gray-300 my-4"></div>
                          <div>
                            <strong>Contact info</strong>
                            <div className="mt-2 flex items-center">
                              <i className="fas fa-user text-gray-500"></i>
                              <span className="ml-2">
                                {groupOrderDetails?.user?.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-envelope text-gray-500"></i>
                              <span className="ml-2">
                                {groupOrderDetails?.user?.email}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-phone text-gray-500"></i>
                              <span className="ml-2">
                                {groupOrderDetails?.user?.mobileNo}
                              </span>
                            </div>
                          </div>

                          {!!groupOrderDetails.address && (
                            <>
                              <div className="h-px bg-gray-300 my-4"></div>
                              <div>
                                <strong>Delivery Address</strong>
                                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded mt-2">
                                  <p>
                                    Full Address:{" "}
                                    <span className="font-bold">
                                      {`${groupOrderDetails?.address?.address.prefix}, ${groupOrderDetails?.address?.address.streetName}, ${groupOrderDetails?.address?.address.locality}, ${groupOrderDetails?.address?.address.postalCode}, ${groupOrderDetails?.address?.address.country}`}
                                    </span>
                                  </p>
                                  <p>
                                    Road:{" "}
                                    {
                                      groupOrderDetails?.address?.address
                                        .streetName
                                    }
                                  </p>
                                  <p>
                                    Postal Code:{" "}
                                    {
                                      groupOrderDetails?.address?.address
                                        .postalCode
                                    }
                                  </p>
                                  <p>
                                    City:{" "}
                                    {groupOrderDetails?.address?.address.city}
                                  </p>
                                  <p>
                                    State:{" "}
                                    {groupOrderDetails?.address?.address.state}
                                  </p>
                                  <div className="font-bold">
                                    <span>
                                      Longitude :{" "}
                                      {groupOrderDetails.address?.location[0]}
                                    </span>
                                    {", "}
                                    <span>
                                      Latitude :{" "}
                                      {groupOrderDetails.address?.location[1]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md mb-6 border">
                        <div className="bg-white p-4">
                          <div className="flex justify-between items-center">
                            <strong>Payment Summary</strong>
                          </div>
                        </div>
                        <div className="p-4">
                          {groupOrderDetails.orderType === "rent" && (
                            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                              <div>
                                This is a rent order, so collect cash upon
                                pickup.
                              </div>
                            </div>
                          )}

                          {groupOrderDetails.orderType === "buy" && (
                            <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
                              <div>
                                This is a buy order, so make sure that payment
                                has been received before proceeding.
                              </div>
                            </div>
                          )}

                          <div className="h-px bg-gray-300 my-4"></div>

                          {summary !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between">
                                <span>
                                  Subtotal (
                                  {groupOrderDetails.totalDocumentCount} items)
                                </span>
                                <span>₹{summary.subTotalPrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>₹{summary.shippingPrice}</span>
                              </div>
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>₹{summary.totalPrice}</span>
                              </div>

                              {groupOrderDetails.orderType === "buy" && (
                                <>
                                  <div className="h-px bg-gray-300 my-4"></div>
                                  <div className="flex justify-between font-bold">
                                    <span>Payment Status</span>
                                    <div className="flex flex-col justify-between">
                                      {summary.paymentStatus === "Pending" && (
                                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-1 rounded-md text-center font-bold">
                                          Pending
                                        </div>
                                      )}
                                      {summary.paymentStatus === "Paid" && (
                                        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-md text-center font-bold">
                                          Paid
                                        </div>
                                      )}
                                      {summary.paymentStatus === "Failed" && (
                                        <div className="bg-purple-100 border border-purple-400 text-purple-700 px-3 py-1 rounded-md text-center font-bold">
                                          Failed
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md border">
                        <div className="bg-white p-4 flex items-center gap-2">
                          <img
                            src="https://st5.depositphotos.com/4226061/62815/v/450/depositphotos_628157962-stock-illustration-invoice-icon-payment-bill-invoice.jpg"
                            alt="Update Status"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <strong>Update Status</strong>
                        </div>
                        <div className="p-4">
                          {groupOrderDetails.orderType === "rent" && (
                            <div className="text-red-500 font-bold mb-4">
                              * This is a rent order, so collect cash upon
                              pickup.
                            </div>
                          )}

                          {groupOrderDetails.orderType === "buy" && (
                            <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
                              <div>
                                This is a buy order, so make sure that payment
                                has been received before proceeding.
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            <strong>Update status of the order</strong>
                            <div className="mt-2">
                              <select
                                onChange={(e) =>
                                  setOrderUpdatableStatus(e.target.value)
                                }
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select Status</option>
                                {groupOrderDetails.orderType === "rent" && (
                                  <option value={"On Progress"}>
                                    On Progress
                                  </option>
                                )}
                                <option value={"Accepted"}>Accept</option>
                                <option value={"Rejected"}>Reject</option>
                                <option value={"On The Way"}>On The Way</option>
                                {groupOrderDetails.orderType === "buy" && (
                                  <option value={"Delivered"}>Delivered</option>
                                )}
                                {groupOrderDetails.orderType === "rent" && (
                                  <option value={"PickUp Ready"}>
                                    PickUp Ready
                                  </option>
                                )}
                              </select>

                              {orderUpdatableStatus === "On The Way" && (
                                <>
                                  <div className="mt-4">
                                    <label
                                      htmlFor="trackingLink"
                                      className="block font-bold mb-2">
                                      Tracking Link
                                    </label>
                                    <input
                                      id="trackingLink"
                                      type="url"
                                      placeholder="https://example.com/id-13"
                                      value={groupTrackingLink}
                                      onChange={(e) =>
                                        setGroupTrackingLink(e.target.value)
                                      }
                                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </>
                              )}

                              <button
                                onClick={handleUpdateOrderStatus}
                                className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                UPDATE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center my-4">
                Please provide a group ID to view order details.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewSingleOrder;
