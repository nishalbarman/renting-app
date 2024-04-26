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
const { OrderList } = require("../../../models/order.model");
const Address = require("../../../models/address.model");
const Center = require("../../../models/center.model");
const PaymentTransModel = require("../../../models/transaction.model");

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

    const paymentTxnId = uuidv4();

    const productNames = paymentObject.productinfo.join(", ");

    const addressDocument = await Address.findById(address);

    // const centerAddresses = await Center.aggregate([
    //   {
    //     $geoNear: {
    //       near: {
    //         type: "Point",
    //         coordinates: addressDocument.location.coordinates,
    //       },
    //       distanceField: "distance",
    //       spherical: true,
    //       // maxDistance: 50000, // Max distance in meters here(50KM)
    //       query: {}, // Additional query conditions can be added here if needed
    //       key: "location", // Specify the field containing the coordinates
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "addresses", // Assuming 'users' is the collection name for the referenced model
    //       localField: "address",
    //       foreignField: "_id",
    //       as: "populatedAddress",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       address: { $arrayElemAt: ["$populatedAddress", 0] },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users", // Assuming 'users' is the collection name for the referenced model
    //       localField: "user",
    //       foreignField: "_id",
    //       as: "populatedUser",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       user: { $arrayElemAt: ["$populatedUser", 0] },
    //     },
    //   },
    //   {
    //     $project: {
    //       populatedAddress: 0, // Remove the temporary populatedAddress field
    //       populatedUser: 0, // Remove the temporary populatedUser field
    //       location: 0,
    //     },
    //   },
    //   { $sort: { distance: 1 } }, // Sort by distance in ascending order
    //   { $limit: 1 }, // Limit to the closest center
    // ]);

    // if (!centerAddresses) {
    //   return res
    //     .status(400)
    //     .json({ message: "Service not available in your location" });
    // }

    // Use an existing Customer ID if this is a returning customer.
    const user = await User.findById(userDetails._id);

    if (!user.stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email, // Provide the email address
        name: user.name, // Provide the customer's name
        phone: user.mobileNo,
        // Add other details as needed
      });
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
        orderGroupID,
        address,
        user: userDetails._id.toString(),
        center: centerAddresses[0]._id.toString(),
        cartProductIds: cartIds.join(","),
      },
    });

    const orderGroupID = uuidv4();

    let orderItemsWithOrderIDandPaymentId;

    if (productType === "buy") {
      orderItemsWithOrderIDandPaymentId = cartItemsForUser.map((item) => {
        const createdOrder = {
          ...item,

          product: item.product._id,
          user: userDetails._id,

          // order related
          orderGroupID: orderGroupID,
          paymentTxnId: paymentIntent.id,

          // product details
          title: item.product.title,

          quantity: item.quantity,
          orderType: "buy",

          address: {
            address: `${addressDocument.name}, ${addressDocument.streetName}, ${addressDocument.locality}, ${addressDocument.postalCode}, ${addressDocument.country}`,
            location: [addressDocument.longitude, addressDocument.latitude],
          },

          center: centerAddresses[0]._id,

          orderStatus: "Pending",
          paymentMode: "PREPAID",
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

    console.log("Created At -->", orderItemsWithOrderIDandPaymentId);

    const orders = await Order.insertMany(orderItemsWithOrderIDandPaymentId);

    await PaymentTransModel.create({
      orderGroupID,
      paymentTransactionID: paymentIntent.id,
      user: userDetails._id,
      order: orders.map((item) => item._id),

      //! Status of Payment
      paymentStatus: "Pending",

      //! PRICE related keys
      shippingPrice: !!shippingApplied ? shippingPrice : 0,
      subTotalPrice:
        paymentObject.amount / 100 - (!!shippingApplied ? shippingPrice : 0),
      totalPrice: paymentObject.amount / 100,
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: user.stripeCustomer.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
