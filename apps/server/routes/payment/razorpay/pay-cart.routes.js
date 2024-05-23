const express = require("express");
const router = express.Router();
const RazorPay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const checkRole = require("../../../middlewares");

const User = require("../../../models/user.model");
const Cart = require("../../../models/cart.model");
const Coupon = require("../../../models/coupon.model");
const Order = require("../../../models/order.model");
const Address = require("../../../models/address.model");
const PaymentTransModel = require("../../../models/transaction.model");

const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

const razorpayInstance = new RazorPay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});

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

    paymentObject.amount *= 100; // gateway takes amount as paisa (1 rupee = 100 paisa)

    const productNames = paymentObject.productinfo.join(", ");

    const addressDocument = await Address.findById(address);

    const user = await User.findById(userDetails._id);

    // if (!user.stripeCustomer) {
    //   const customer = await stripe.customers.create({
    //     email: user.email, // Provide the email address
    //     name: user.name, // Provide the customer's name
    //     phone: user.mobileNo,
    //     // Add other details as needed
    //   });
    //   user.stripeCustomer = customer;
    // }

    // await user.save({ validateBeforeSave: false });

    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   { customer: user.stripeCustomer.id },
    //   { apiVersion: "2024-04-10" }
    // );

    const paymentTxnId = uuidv4();
    const orderGroupID = uuidv4();

    // create one razor pay order with the amount
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: paymentObject.amount,
      currency: "INR",
      receipt: paymentTxnId,
      partial_payment: false,
      notes: {
        orderGroupID,
        user: userDetails._id.toString(),
        address,
        cartProductIds: cartIds.join(","),
        productIds: cartItemsForUser.map((item) => item.product._id).join(","),
        description: productNames,
        paymentTxnId: paymentTxnId,
      },
    });

    console.log(razorpayOrder);

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

      paymentStatus: "Pending",

      shippingPrice: !!shippingApplied ? shippingPrice : 0,
      subTotalPrice:
        paymentObject.amount / 100 - (!!shippingApplied ? shippingPrice : 0),
      totalPrice: paymentObject.amount / 100,
    });

    return res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      name: userDetails.name,
      email: userDetails.email,
      mobileNo: userDetails.mobileNo,
      productinfo: productNames,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
