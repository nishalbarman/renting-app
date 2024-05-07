const express = require("express");
const router = express.Router();
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const Center = require("../../models/center.model");
const { default: mongoose } = require("mongoose");
const checkRole = require("../../middlewares");
const shipRocketLogin = require("../../helpter/shipRocketLogin");
const PaymentTransModel = require("../../models/transaction.model");

//! ORDER LISTING ROUTE FOR ADMIN AND CENTER
router.get("/list", checkRole(1, 2), async (req, res) => {
  try {
    const searchQuery = req.query;

    const PAGE = +searchQuery.page || 0;
    const LIMIT = +searchQuery.limit || 20;
    const SKIP = +PAGE * LIMIT;

    const orderStatus = searchQuery?.orderStatus;

    const role = req?.jwt?.role;

    const filterQuery = {};

    if (role === 2) {
      filterQuery.center = req.jwt?.center;
    }

    if (orderStatus) {
      filterQuery.orderStatus = orderStatus;
    }

    const pipeline = [
      {
        $match: {
          orderGroupID: { $exists: true, $ne: null },
          orderStatus: orderStatus ? orderStatus : { $exists: true },
          ...(role === 2 && { center: req.jwt?.center }),
        },
      },
      // {
      //   $sort: { createdAt: 1 },
      // },
      {
        $group: {
          _id: "$orderGroupID",
          totalDocumentCount: { $sum: 1 },
          totalPrice: { $sum: "$price" },
          paymentTransactionId: { $push: "$paymentTxnId" },
          orderType: { $push: "$orderType" },
          orders: { $push: "$$ROOT" },
          createdAt: { $first: "$createdAt" }, // Extract createdAt from the first order in each group
        },
      },
      {
        $addFields: {
          createdAt: "$createdAt", // Add createdAt field to the grouped document
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort the output list based on createdAt in descending order
      },
      {
        $group: {
          _id: null,
          globalTotalDocumentCount: { $sum: 1 },
          address: { $first: "$orders.address" },
          user: { $first: "$orders.user" },
          groupedOrders: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            { $match: {} },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                mobileNo: 1,
                isMobileNoVerifed: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          globalTotalDocumentCount: 1,
          groupedOrders: {
            $slice: [
              {
                $map: {
                  input: "$groupedOrders",
                  as: "group",
                  in: {
                    orderGroupID: "$$group._id",
                    totalDocumentCount: "$$group.totalDocumentCount",
                    paymentTransactionId: {
                      $arrayElemAt: ["$$group.paymentTransactionId", 0],
                    },
                    orderType: {
                      $arrayElemAt: ["$$group.orderType", 0],
                    },
                    totalPrice: "$$group.totalPrice",
                    address: {
                      $arrayElemAt: ["$address", 0],
                    },
                    user: { $arrayElemAt: ["$user", 0] },
                    orders: "$$group.orders",
                    createdAt: "$$group.createdAt", // Include createdAt field
                  },
                },
              },
              SKIP,
              LIMIT,
            ],
          },
        },
      },
    ];

    const orderDetails = await Order.aggregate(pipeline);

    return res.json(orderDetails[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

router.get("/details/:orderGroupID", checkRole(1, 2), async (req, res) => {
  try {
    const orderGroupID = req.params?.orderGroupID;

    const role = req.jwt?.role;

    const pipeline = [
      {
        $match: {
          orderGroupID: orderGroupID,
          ...(role === 2 && { center: req.jwt?.center || "_blank" }),
        },
      },
      {
        $group: {
          _id: "$orderGroupID",
          totalDocumentCount: { $sum: 1 },
          totalPrice: { $sum: "$price" },
          paymentTransactionId: { $push: "$paymentTxnId" },
          orderType: { $push: "$orderType" },
          orders: { $push: "$$ROOT" },
          createdAt: { $first: "$createdAt" }, // Extract createdAt from the first order in each group
        },
      },
      {
        $addFields: {
          createdAt: "$createdAt", // Add createdAt field to the grouped document
        },
      },

      {
        $group: {
          _id: null,
          globalTotalDocumentCount: { $sum: 1 },
          address: { $first: "$orders.address" },
          user: { $first: "$orders.user" },
          groupedOrders: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            { $match: {} },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                mobileNo: 1,
                isMobileNoVerifed: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          globalTotalDocumentCount: 1,
          groupedOrders: {
            $map: {
              input: "$groupedOrders",
              as: "group",
              in: {
                orderGroupID: "$$group._id",
                totalDocumentCount: "$$group.totalDocumentCount",
                paymentTransactionId: {
                  $arrayElemAt: ["$$group.paymentTransactionId", 0],
                },
                orderType: {
                  $arrayElemAt: ["$$group.orderType", 0],
                },
                totalPrice: "$$group.totalPrice",
                address: {
                  $arrayElemAt: ["$address", 0],
                },
                user: { $arrayElemAt: ["$user", 0] },
                orders: "$$group.orders",
                createdAt: "$$group.createdAt", // Include createdAt field
              },
            },
          },
        },
      },
    ];

    const orderDetails = await Order.aggregate(pipeline);

    console.log("Order Details --> ", orderDetails);

    return res.json(orderDetails[0].groupedOrders[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

//! Order details for normal user, orders can be viewed with the transaction id
router.get("/view/:paymentTransactionId", checkRole(0), async (req, res) => {
  try {
    const paymentTransactionId = req.params?.paymentTransactionId;

    const orderDetails = await PaymentTransModel.findOne({
      paymentTransactionID: paymentTransactionId,
    }).populate("order");

    return res.json({ orderDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

//! ORDER LISTING ROUTE FOR NORMAL USERS
router.get("/l/:productType", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const searchQuery = req.query;

    const productType = req.params?.productType;

    console.log(productType);

    const PAGE = searchQuery.page || 0;
    const LIMIT = searchQuery.limit || 20;
    const SKIP = PAGE * LIMIT;

    let orderDetails = undefined;
    let countDocuments = undefined;
    let totalPages = 0;

    if (productType === "buy") {
      countDocuments = await Order.countDocuments({
        user: userDetails._id,
        orderType: productType,
      });

      orderDetails = await Order.find({
        user: userDetails._id,
        orderType: productType,
      })

        .sort({ createdAt: "desc" })
        .skip(SKIP)
        .limit(LIMIT)
        .populate("orderGroupID");
    } else {
      countDocuments = await Order.countDocuments({
        user: userDetails._id,
        orderType: productType,
      });

      orderDetails = await Order.find({
        user: userDetails._id,
        orderType: productType,
      })
        .sort({ createdAt: "desc" })
        .skip(SKIP)
        .limit(LIMIT);
    }

    totalPages = Math.ceil(countDocuments / LIMIT);

    return res.json({
      data: orderDetails,
      totalPage: totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
});

//! ORDER STATUS UPDATING ROUTE CAN BE USED BY ADMIN AND CENTER
router.patch("/update-status", checkRole(1, 2), async (req, res) => {
  try {
    const order = req.body?.order;
    const orderStatus = req.body?.orderStatus;

    if (!order || !orderStatus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const role = req?.jwt?.role;
    const center = req?.jwt?.center;

    let orderFilter = {};

    //! FROM admin panel we can get an array or signle group id. if admin selects multiple orders updation will happen based on order _id otherwise it will happen based on orderGroupID

    if (Array.isArray(order)) {
      orderFilter = { _id: { $in: order } };
    } else {
      orderFilter = { orderGroupID: order };
    }

    orderFilter.orderStatus = { $ne: "Cancelled" };

    if (role === 2) {
      // center
      if (!center) {
        return res
          .status(400)
          .json({ message: "No center available for given user ID" });
      }
      orderFilter.center = center;
    }

    await Order.updateMany(orderFilter, { $set: { orderStatus } });

    return res.json({
      message: "Order status updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

//! ORDER CANCELLATION ROUTE CAN BE USED BY ADMIN AND NORMAL USERS
router.patch("/cancel", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(401).json({
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(401).json({
        message: "Authorization failed",
      });
    }

    const orderId = req.body?.orderId;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is missing!" });
    }
    // order can only be cancelled when the order state is among these three states
    const orderFilter = {
      _id: orderId,
    };

    console.log(userDetails?.role);
    if (!userDetails?.role && userDetails?.role !== 0) {
      return res.status(400).json({ message: "User role missing" });
    }

    if (userDetails.role === 0) {
      orderFilter.user = userDetails._id;
      orderFilter.orderStatus = { $in: ["On Hold", "On Progress", "Accepted"] };
    } else if (userDetails.role === 2) {
      // const center = await Center.findOne({ user: userDetails._id });
      const center = userDetails?.center;
      if (!center) {
        return res
          .status(400)
          .json({ message: "No center available for given user ID" });
      }
      orderFilter.center = center;
    }

    console.log(userDetails);

    const order = await Order.findOneAndUpdate(orderFilter, {
      $set: {
        orderStatus: "Cancelled",
      },
    });

    if (!order) {
      return res.json({
        message: "Cancellation Failed",
      });
    }
    return res.json({
      message: "Order Cancelled",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

//! ORDER CHART DATA -- CAN BE USED BY ADMIN AND CENTER
router.get("/get-order-chart-data", checkRole(1), async (req, res) => {
  try {
    const year = parseInt(req.query?.year);
    const month = parseInt(req.query?.month);

    const pipeline = [
      // Stage 1: Match orders with specific statuses
      {
        $match: {
          $or: [
            { orderStatus: "Delivered" },
            { orderStatus: "Cancelled" },
            { orderStatus: "Rejected" },
          ],
        },
      },
      // Stage 2: Group by updated date and count orders for each status
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
            day: { $dayOfMonth: "$updatedAt" },
          },
          deliveredCount: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Cancelled"] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Rejected"] }, 1, 0] },
          },
        },
      },
      // Stage 3: Project to format date and rename fields
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%B %d, %Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          deliveredCount: 1,
          cancelledCount: 1,
          rejectedCount: 1,
          pendingCount: 1,
        },
      },
      // Stage 4: Sort by date
      {
        $sort: { date: 1 },
      },
      // Stage 5: Group to calculate totals
      {
        $group: {
          _id: null,
          totalDeliveredOrders: { $sum: "$deliveredCount" },
          totalCancelledOrders: { $sum: "$cancelledCount" },
          totalRejectedOrders: { $sum: "$rejectedCount" },
          chartData: { $push: "$$ROOT" },
        },
      },
      // Stage 6: Project to reshape output
      {
        $project: {
          _id: 0,
          totalDeliveredOrders: 1,
          totalCancelledOrders: 1,
          totalRejectedOrders: 1,
          totalPendingOrders: {
            $subtract: [
              {
                $sum: [
                  "$totalDeliveredOrders",
                  "$totalCancelledOrders",
                  "$totalRejectedOrders",
                ],
              },
              "$totalDeliveredOrders",
            ],
          },
          chartData: 1,
        },
      },
    ];

    const data = await Order.aggregate(pipeline);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error && error?.errors) {
      const errArray = Object.values(error.errors).map(
        (properties) => properties.message
      );

      return res.status(400).json({
        message: errArray.join(", "),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

//! RENT ORDER PLACING ROUTE FOR USER
router.use("/renting", require("./rent-order.routes"));

module.exports = router;
