const express = require("express");
const router = express.Router();
const RazorPay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const Cart = require("../../../../models/cart.model");
const Coupon = require("../../../../models/coupon.model");
const Order = require("../../../../models/order.model");
const RazorPayOrder = require("../../../../models/razorpay.model");

const getTokenDetails = require("../../../../helpter/getTokenDetails");

const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

router.get("/", async (req, res) => {
  try {
    const userCookies = req.cookies.token || null;
    const token = userCookies?.value || null;

    if (!token) {
      return res.redirect("/auth/login?redirect=cart");
    }

    const userDetails = getTokenDetails(token) || null;

    if (!userDetails) {
      return res.redirect("/auth/login?redirect=cart");
    }

    const appliedCouponID = req.query.coupon || null;

    const cartItemsForUser = await Cart.find({
      user: userDetails._id,
    }).populate([
      "size",
      "color",
      {
        path: "product",
        select:
          "-_id title discountedPrice originalPrice previewUrl shippingPrice",
      },
    ]);

    if (!cartItemsForUser) {
      return res
        .status(403)
        .json({ status: false, message: "No items on cart" });
    }

    const paymentObject = cartItemsForUser?.reduce(
      (pay, singleProduct) => {
        const itemTitle = singleProduct.product.title;
        const itemBuyPrice = singleProduct.product.discountedPrice;
        const itemQuantity = singleProduct.quantity;
        const totalItemPrice = itemBuyPrice * itemQuantity;

        return {
          amount: pay.amount + totalItemPrice,
          productinfo: [...pay.productinfo, itemTitle],
        };
      },
      { amount: 0, productinfo: [] }
    );

    paymentObject.amount *= 100;

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

    const instance = new RazorPay({
      key_id: RAZORPAY_KEY,
      key_secret: RAZORPAY_SECRET,
    });

    const txnid = uuidv4();

    const productNames = paymentObject.productinfo.join(", ");

    const razorpayOrder = await instance.orders.create({
      amount: paymentObject.amount,
      currency: "INR",
      receipt: txnid,
      partial_payment: false,
      notes: {
        customerName: userDetails.name,
        customerEmail: userDetails.email,
        productIDs: cartItemsForUser.map((item) => item._id).join(", "),
        productNames: productNames,
        transactionId: txnid,
      },
    });

    const txnAndOrderIdInsertedCartItems = cartItemsForUser.map((item) => ({
      ...item,
      txnid: txnid,
      title: item.product.title,
      previewUrl: item.product.previewUrl,
      discountedPrice: item.product.discountedPrice,
      originalPrice: item.product.originalPrice,
      shippingPrice: item.product.shippingPrice,
      orderId: uuidv4(),
      user: userDetails._id,
    }));

    const orders = await Order.insertMany(txnAndOrderIdInsertedCartItems);

    const razorpayOrderIdList = orders.map((item) => ({
      razorPayOrderId: razorpayOrder.id,
      order: item._id,
      user: userDetails._id,
    }));

    await RazorPayOrder.insertMany(razorpayOrderIdList);

    return res.status(201).json({
      status: true,
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

module.exports = router;
