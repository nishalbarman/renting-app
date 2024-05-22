const express = require("express");
const router = express.Router();
const https = require("https");

const PaytmChecksum = require("paytmchecksum");

const { v4: uuidv4 } = require("uuid");

const checkRole = require("../../../middlewares");

const User = require("../../../models/user.model");
const Cart = require("../../../models/cart.model");
const Coupon = require("../../../models/coupon.model");
const Order = require("../../../models/order.model");
const Address = require("../../../models/address.model");
const PaymentTransModel = require("../../../models/transaction.model");
const { default: axios } = require("axios");
const { resolve } = require("path");

const PAYTM_MERCHANT_KEY = process.env.PAYTM_MKEY;
const PAYTM_MID = process.env.PAYTM_MID;

router.post("/:productType", checkRole(0), async (req, res) => {
  try {
    const productType = req.params?.productType;
    const address = req.body?.address;

    const userDetails = req.user;

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
      return res.status(400).json({ message: "Cart is empty" });
    }

    let shippingPrice = 0;

    // TODO: Still NEED to handle out of stock products

    const cartIds = [];

    const paymentObject = cartItemsForUser.reduce(
      (pay, cartItem) => {
        cartIds.push(cartItem._id);

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

          shippingPrice += cartItem.product.shippingPrice;
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

    const freeDeliveryAboveMinimumPurchase = false; // TODO: Need to get it from server.
    const freeDeliveryMinimumAmount = 500;
    let shippingApplied = false;

    if (
      !(
        freeDeliveryAboveMinimumPurchase &&
        paymentObject.amount >= freeDeliveryMinimumAmount
      )
    ) {
      paymentObject.amount += shippingPrice;
      shippingApplied = true;
    }

    // paymentObject.amount *= 100; // gateway takes amount as paisa (1 rupee = 100 paisa)

    const productNames = paymentObject.productinfo.join(", ");

    const addressDocument = await Address.findById(address);

    const user = await User.findById(userDetails._id);

    const paymentTxnId = uuidv4();
    const orderGroupID = uuidv4();

    // const razorpayOrder = await razorpayInstance.orders.create({
    //   amount: paymentObject.amount,
    //   currency: "INR",
    //   receipt: paymentTxnId,
    //   partial_payment: false,
    //   notes: {
    //     orderGroupID,
    //     user: userDetails._id.toString(),
    //     address,
    //     cartProductIds: cartIds.join(","),
    //     productIds: cartItemsForUser.map((item) => item.product._id).join(","),
    //     description: productNames,
    //     transactionId: paymentTxnId,
    //   },
    // });

    let paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: PAYTM_MID,
      websiteName: "WEBSTAGING",
      orderId: orderGroupID,
      callbackUrl:
        "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=" +
        orderGroupID,
      txnAmount: {
        value: Number(paymentObject.amount).toFixed(2).toString(),
        currency: "INR",
      },
      userInfo: {
        custId: user._id.toString(),
        email: user.email, // Provide the email address
        firstName: user.name, // Provide the customer's name
        mobile: user.mobileNo,
      },
    };

    console.log(paytmParams.body);

    /*
     * Generate checksum by parameters we have in body
     * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
     */
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PAYTM_MERCHANT_KEY
    );

    paytmParams.head = {
      channelId: "WAP",
      signature: checksum,
    };

    console.log("Did I got the checksum", checksum);

    const post_data = JSON.stringify(paytmParams);

    const response = await axios.post(
      `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${PAYTM_MID}&orderId=${orderGroupID}`,
      paytmParams,
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      }
    );

    console.log(response.data);

    let orderItemsWithOrderIDandPaymentId;

    if (productType === "buy") {
      orderItemsWithOrderIDandPaymentId = cartItemsForUser.map((item) => {
        const createdOrder = {
          ...item,

          product: item.product._id,
          user: userDetails._id,

          // order related
          orderGroupID: orderGroupID,
          // paymentTxnId: paymentIntent.id,
          paymentTxnId: paymentTxnId,

          // product details
          title: item.product.title,

          quantity: item.quantity,
          orderType: "buy",

          address: {
            address: {
              prefix: addressDocument?.prefix,
              streetName: addressDocument.streetName,
              locality: addressDocument.locality,
              city: addressDocument.locality,
              state: addressDocument.locality,
              postalCode: addressDocument.postalCode,
              country: addressDocument.country,
            },
            location: [addressDocument.longitude, addressDocument.latitude],
          },

          // center: centerAddresses[0]._id,
          center: null,

          orderStatus: "Pending",
          paymentMode: "Prepaid",
          shipmentType: "delivery_partner",
        };

        if (!!item.variant) {
          createdOrder.previewImage = item.variant.previewImage;
          createdOrder.price = item.variant.discountedPrice * item.quantity;
          createdOrder.shippingPrice = +item.variant.shippingPrice;

          createdOrder.color = item.variant.color;
          createdOrder.size = item.variant.size;
        } else {
          createdOrder.previewImage = item.product.previewImage;
          createdOrder.price = item.product.discountedPrice * item.quantity;
          createdOrder.shippingPrice = +item.product.shippingPrice;

          createdOrder.color = null;
          createdOrder.size = null;
        }

        return createdOrder;
      });
    }

    const orders = await Order.insertMany(orderItemsWithOrderIDandPaymentId);

    await PaymentTransModel.create({
      orderGroupID,
      // paymentTransactionID: paymentIntent.id,
      paymentTransactionID: paymentTxnId,
      user: userDetails._id,
      order: orders.map((item) => item._id),

      //! initial status of payment
      paymentStatus: "Pending",

      //! PRICE related keys
      shippingPrice: !!shippingApplied ? shippingPrice : 0,
      subTotalPrice:
        paymentObject.amount / 100 - (!!shippingApplied ? shippingPrice : 0),
      totalPrice: paymentObject.amount / 100,
    });

    return res.status(200).json({
      orderId: orderGroupID,
      txnToken: response.data.body.txnToken,
      amount: paymentObject.amount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
