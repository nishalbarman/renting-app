const express = require("express");
const router = express.Router();
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const Center = require("../../models/center.model");

// for admin and centers
router.get("/", async (req, res) => {
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

    const PAGE = searchQuery.page || 1;
    const LIMIT = searchQuery.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const orderDetails = await Order.find({
      user: userDetails._id,
    })
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT)
      .populate("paymentTxnId");

    return res.json({
      status: true,
      data: orderDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

// for normal users
router.get("/:productType", async (req, res) => {
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

    const PAGE = searchQuery.page || 1;
    const LIMIT = searchQuery.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

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
        .populate("paymentTxnId");
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

router.post("/:productType", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(401).json({ message: "Authorization failed" });
    }

    const centerId = req.params?.centerId;

    if (!centerId) {
      return res.status(400).json({ message: "Center not selected" });
    }

    const appliedCouponID = req?.query?.coupon;

    const cartItemsForUser = await Cart.find({
      user: userDetails._id,
      productType: productType,
    }).populate([
      {
        path: "product",
        select: "-productVariant",
      },
      {
        path: "variant",
        select: "-product",
      },
    ]);

    if (!cartItemsForUser) {
      return res.status(400).json({ message: "No items on cart" });
    }

    let shippingPrice = 0;

    // TODO: Still NEED to handle out of stock products

    const paymentObject = cartItemsForUser.reduce(
      (pay, cartItem) => {
        let totalPrice; // price for one cart item
        const Title = cartItem.product.title;

        // if type is buy and product have variants (diffent color different size etc etc)
        if (productType === "buy" && !!cartItem.variant) {
          const Price = cartItem.variant.discountedPrice;
          const Quantity = cartItem.quantity;
          totalPrice = Price * Quantity;

          shippingPrice += cartItem.variant.shippingPrice;
        }
        // else if type is buy and product does not have variants (diffent color different size etc etc)
        else if (productType === "buy" && !cartItem.variant) {
          const Price = cartItem.product.discountedPrice;
          const Quantity = cartItem.quantity;
          totalPrice = Price * Quantity;

          shippingPrice += cartItem.variant.shippingPrice;
        }
        // else if type is rent and product does not have variants (diffent color different size etc etc)
        else if (productType === "rent" && !!cartItem.variant) {
          const Price = cartItem.variant.rentingPrice;
          const Quantity = cartItem.quantity;
          const RentDays = cartItem.rentDays;
          totalPrice = Price * Quantity * RentDays;

          shippingPrice += cartItem.variant.shippingPrice;
        }
        // else if type is rent and product does not have variants (diffent color different size etc etc)
        else if (productType === "rent" && !cartItem.variant) {
          const Price = cartItem.product.rentingPrice;
          const Quantity = cartItem.quantity;
          const RentDays = cartItem.rentDays;
          totalPrice = Price * Quantity * RentDays;

          shippingPrice += cartItem.variant.shippingPrice;
        }

        return {
          amount: pay.amount + totalPrice,
          productinfo: [...pay.productinfo, Title],
        };
      },
      { amount: 0, productinfo: [] }
    );

    if (!!appliedCouponID) {
      const appliedCoupon = await Coupon.findOne({ _id: appliedCouponID });

      if (!!appliedCoupon) {
        const discountedPrice = appliedCoupon?.isPercentage
          ? (paymentObject.amount / 100) * parseInt(appliedCoupon.off) || 0
          : paymentObject.amount >
              (appliedCoupon.minimumPayAmount || paymentObject.amount + 100)
            ? appliedCoupon.off
            : 0;

        paymentObject.amount -= discountedPrice;
      }
    }

    const freeDeliveryAboveMinimumPurchase = true;
    const freeDeliveryMinimumAmount = 500;

    if (
      !(
        freeDeliveryAboveMinimumPurchase &&
        paymentObject.amount >= freeDeliveryMinimumAmount
      )
    ) {
      paymentObject.amount += shippingPrice;
    }

    paymentObject.amount *= 100; // razor pay takes amount as paisa (1 rupee = 100 paisa)

    const paymentTxnId = uuidv4();

    const productNames = paymentObject.productinfo.join(", ");

    // create one razor pay order with the amount
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: paymentObject.amount,
      currency: "INR",
      receipt: paymentTxnId,
      partial_payment: false,
      notes: {
        customerName: userDetails.name,
        customerEmail: userDetails.email,
        productIDs: cartItemsForUser.map((item) => item._id).join(", "),
        productNames: productNames,
        transactionId: paymentTxnId,
      },
    });

    let txnAndOrderIdInsertedCartItems;

    if (productType === "buy") {
      txnAndOrderIdInsertedCartItems = cartItemsForUser.map((item) => {
        if (!!item.variant) {
          return {
            ...item,
            // order related
            orderId: uuidv4(),
            paymentTxnId: paymentTxnId,

            // product details
            title: item.product.title,
            previewUrl: item.product.previewUrl,
            price: item.variant.discountedPrice,
            shippingPrice: item.variant.shippingPrice,
            orderType: "buy",
            color: item.variant.color,
            size: item.variant.size,
            address: item.user.defaultSelectedAddress,
            // user details
            user: userDetails._id,
          };
        }

        // if no variant available
        return {
          ...item,
          // order related
          orderId: uuidv4(),
          paymentTxnId: paymentTxnId,

          // product details
          title: item.product.title,
          previewUrl: item.product.previewUrl,
          price: item.discountedPrice,
          shippingPrice: item.shippingPrice,
          orderType: "buy",
          address: item.user.defaultSelectedAddress,
          // user details
          user: userDetails._id,
        };
      });
    } else {
      txnAndOrderIdInsertedCartItems = cartItemsForUser.map((item) => {
        if (!!item.variant) {
          return {
            ...item,
            // order related
            orderId: uuidv4(),
            paymentTxnId: paymentTxnId,

            // product details
            title: item.product.title,
            previewUrl: item.product.previewUrl,
            price: item.variant.discountedPrice,
            shippingPrice: item.variant.shippingPrice,
            orderType: "rent",
            color: item.variant.color,
            size: item.variant.size,
            address: item.user.defaultSelectedAddress,
            // user details
            user: userDetails._id,
          };
        }

        // if no variant available
        return {
          ...item,
          // order related
          orderId: uuidv4(),
          paymentTxnId: paymentTxnId,

          // product details
          title: item.product.title,
          previewUrl: item.product.previewUrl,
          price: item.rentingPrice,
          shippingPrice: item.shippingPrice,
          orderType: "rent",
          address: item.user.defaultSelectedAddress,
          // user details
          user: userDetails._id,
        };
      });
    }

    const orders = await Order.insertMany(txnAndOrderIdInsertedCartItems);

    const razorpayOrderIdList = orders.map((item) => ({
      razorPayOrderId: razorpayOrder.id,
      order: item._id,
      user: userDetails._id,
    }));

    // insert the records in razor pay collection
    await RazorPayOrder.insertMany(razorpayOrderIdList);

    return res.status(200).json({
      payment: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        name: userDetails.name,
        email: userDetails.email,
        mobileNo: userDetails.mobileNo,
        productinfo: productNames,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

router.patch("/", async (req, res) => {
  try {
    const token = req.jwt.token || null;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(userToken.value);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const { productId, size, color } = req.body;

    // Assuming Cart model is imported and defined
    const cart = new Cart({
      user: userDetails._id,
      product: productId,
    });

    if (size) {
      cart.size = size;
    }

    if (color) {
      cart.color = color;
    }

    await cart.save();

    return res.json({
      status: true,
      message: "Item added to Cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

// user and admin router for order cancellation
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
      orderStatus: { $in: ["On Hold", "On Progress", "Accepted"] },
    };

    if (userDetails.role === 0) {
      orderFilter.user = userDetails._id;
    } else if (userDetails.role === 2) {
      const center = await Center.findOne({ _id: user._id });
      if (!center) {
        return res
          .status(401)
          .json({ message: "No center available with given ID" });
      }
      orderFilter.pickupCenter = center._id;
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
      status: true,
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

router.use("/renting", require("./rent-order.routes"));

module.exports = router;
