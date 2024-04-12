const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");

// const Coupon = require("../../../../models/coupon.model");

// GET endpoint
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

    const productType = req.params?.productType;

    if (!productType) {
      return res.status(400).json({ message: "Product Type Not Found" });
    }

    const centerId = req.query?.centerId;

    if (!centerId) {
      return res.status(400).json({ message: "Center not selected" });
    }

    // const appliedCouponID = req?.query?.coupon;

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

    const paymentTxnId = uuidv4();

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

            center: centerId,

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

          center: centerId,

          // user details
          user: userDetails._id,
        };
      });
    } else {
      txnAndOrderIdInsertedCartItems = cartItemsForUser.map((item) => {
        if (!!item?.variant) {
          return {
            ...item,
            // order related
            orderId: "RENT-" + uuidv4(),
            // paymentTxnId: paymentTxnId,

            // product details
            title: item.product.title,
            previewUrl: item.product.previewUrl,
            price: item.variant.rentingPrice,
            shippingPrice: item.variant.shippingPrice,
            orderType: "rent",
            color: item.variant.color,
            size: item.variant.size,
            quantity: item.quantity,
            rentDays: item.rentDays,

            orderStatus: "On Hold",

            // address: item.user.defaultSelectedAddress,
            pickupCenter: centerId,
            shipmentType: "self_pickup",
            paymentMode: "COP",

            center: centerId,

            // user details
            user: userDetails._id,
            paymentStatus: null,
          };
        }

        // if no variant available
        return {
          ...item,
          // order related
          orderId: "RENT-" + uuidv4(),
          // paymentTxnId: paymentTxnId,

          // product details
          title: item.product.title,
          previewUrl: item.product.previewUrl,
          price: item.product.rentingPrice,
          shippingPrice: item.product.shippingPrice,
          orderType: "rent",
          quantity: item.quantity,
          rentDays: item.rentDays,

          orderStatus: "On Hold",

          // address: item.user.defaultSelectedAddress,
          pickupCenter: centerId,
          shipmentType: "self_pickup",
          paymentMode: "COP",

          center: centerId,

          // user details
          user: userDetails._id,
          paymentStatus: null,
        };
      });
    }

    // insert order for user
    const orders = await Order.insertMany(txnAndOrderIdInsertedCartItems);
    if (!!orders) {
      const cartRemoved = await Cart.deleteMany({
        user: userDetails._id,
        productType: productType,
      });
      return res.status(200).json({ message: "Order Placed!" });
    }

    return res.status(200).json({ message: "Order Could Not Be Placed!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

// PATCH endpoint
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

module.exports = router;
