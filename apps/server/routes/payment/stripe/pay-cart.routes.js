const express = require("express");
const router = express.Router();
// const RazorPay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const getTokenDetails = require("../../../helpter/getTokenDetails");

// const RazorPayOrder = require("../../../../models/razorpay.model");

const User = require("../../../models/user.model");
const Cart = require("../../../models/cart.model");
const Coupon = require("../../../models/coupon.model");
const Order = require("../../../models/order.model");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

const stripe = require("stripe")(STRIPE_SECRET_KEY);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

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
    const address = req.body?.address;

    if (!productType || !address) {
      return res.status(400).json({ message: "Parameters missing" });
    }

    const appliedCouponID = req.query.coupon || null;

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
          price: item.product.discountedPrice,
          shippingPrice: item.product.shippingPrice,
          orderType: "buy",
          address: "address",
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

    // Use an existing Customer ID if this is a returning customer.
    const user = await User.findById(userDetails._id);

    if (!user.stripeCustomer) {
      const customer = await stripe.customers.create();
      user.stripeCustomer = customer;
    }

    await user.save({ validateBeforeSave: false });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: user.stripeCustomer.id },
      { apiVersion: "2024-04-10" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentObject.amount,
      currency: "inr",
      customer: user.stripeCustomer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      description: productNames,
      metadata: {
        paymentTxnId,
      },
    });

    const orders = await Order.insertMany(txnAndOrderIdInsertedCartItems);

    // const razorpayOrderIdList = orders.map((item) => ({
    //   razorPayOrderId: razorpayOrder.id,
    //   paymentTxnId,
    //   order: item._id,
    //   user: userDetails._id,
    // }));

    // insert the records in razor pay collection
    // await RazorPayOrder.insertMany(razorpayOrderIdList);

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: user.stripeCustomer.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });

    // return res.status(200).json({
    //   payment: {
    //     razorpayOrderId: razorpayOrder.id,
    //     amount: razorpayOrder.amount,
    //     name: userDetails.name,
    //     email: userDetails.email,
    //     mobileNo: userDetails.mobileNo,
    //     productinfo: productNames,
    //   },
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
