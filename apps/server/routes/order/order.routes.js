const express = require("express");
const router = express.Router();
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const Center = require("../../models/center.model");
const { default: mongoose } = require("mongoose");
const checkRole = require("../../middlewares");

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

    // const totalOrderCount = await Order.countDocuments(filterQuery);

    // const orderDetails = await Order.find(filterQuery)
    //   .sort({ createdAt: "desc" })
    //   .skip(SKIP)
    //   .limit(LIMIT)
    //   .populate([
    //     { path: "address" },
    //     { path: "user", select: "name email mobileNo" },
    //   ]);

    const pipeline = [
      {
        $match: {
          orderGroupID: { $exists: true, $ne: null }, // Filter orders with orderGroupID
        },
      },
      {
        $group: {
          _id: "$orderGroupID",
          totalDocumentCount: { $sum: 1 }, // Count total documents per orderGroupID
          totalPrice: { $sum: "$price" }, // Calculate total price per orderGroupID
          paymentTransactionId: { $push: "$paymentTxnId" },
          orderType: { $push: "$orderType" },
          orders: { $push: "$$ROOT" }, // Push all matching orders into an array
        },
      },
      {
        $group: {
          _id: null,
          globalTotalDocumentCount: { $sum: 1 }, // Count the total number of grouped order groups
          // paymentTransactionId: { $first: "$orders.paymentTxnId" }, // payment Transaction ID
          address: { $first: "$orders.address" }, // Extract one address from the first document
          user: { $first: "$orders.user" }, // Extract one user from the first document
          groupedOrders: { $push: "$$ROOT" }, // Push all grouped orders into an array
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
            }, // Add select options here
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
                totalPrice: "$$group.totalPrice", // Include totalPrice field
                address: {
                  $arrayElemAt: ["$address", 0], // Extract the address data
                },
                user: { $arrayElemAt: ["$user", 0] }, // Extract the user data
                orders: {
                  $slice: ["$$group.orders", SKIP, LIMIT], // Apply pagination
                },
              },
            },
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
router.patch("/orderStatus/:orderId", checkRole(1, 2), async (req, res) => {
  try {
    const orderId = req.params?.orderId;
    const orderStatus = req.body?.orderStatus;

    if (!orderId || !orderStatus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const role = req?.jwt?.role;
    const center = req?.jwt?.center;

    const orderFilter = { _id: orderId };

    if (role === 2) {
      // center
      if (!center) {
        return res
          .status(400)
          .json({ message: "No center available for given user ID" });
      }
      orderFilter.center = center;
    }

    await Order.updateOne(orderFilter, { $set: { orderStatus } });

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
