const express = require("express");
const router = express.Router();
// const RazorPay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

// const RazorPayOrder = require("../../../../models/razorpay.model");

const User = require("../../../models/user.model");
const { Product, ProductVariant } = require("../../../models/product.model");
const Coupon = require("../../../models/coupon.model");
const Order = require("../../../models/order.model");
const Address = require("../../../models/address.model");
const Center = require("../../../models/center.model");
const PaymentTransModel = require("../../../models/transaction.model");

const checkRole = require("../../../middlewares");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

const stripe = require("stripe")(STRIPE_SECRET_KEY);

router.post("/:productType", checkRole(0, 1), async (req, res) => {
  try {
    const productType = req.params?.productType;

    const productId = req.body?.productId;
    const productVariantId = req.body?.productVariantId;
    const quantity = req.body?.quantity;
    const address = req.body?.address;

    if (!productType || !address || !productId) {
      return res.status(403).json({ message: "Required fields not found" });
    }

    const appliedCouponID = req.query.coupon || null;

    const productItem = await Product.findOne({ _id: productId });
    let productVariantItem = null;

    if (productVariantId) {
      productVariantItem = await ProductVariant.findOne({
        _id: productVariantId,
      });
    }

    console.log("Product variant", productVariantItem);
    console.log("Product ", productItem);

    // TODO: Still NEED to handle out of stock products

    let totalPrice = 0; // price for one cart item
    let shippingPrice = 0;

    const Title = productItem.title;

    // if type is buy and product have variants (diffent color different size etc etc)
    if (productType === "buy" && !!productVariantItem) {
      const Price = productVariantItem.discountedPrice;
      const Quantity = quantity;
      totalPrice = Price * Quantity;

      shippingPrice += productVariantItem.shippingPrice;
    }
    // else if type is buy and product does not have variants (diffent color different size etc etc)
    else if (productType === "buy" && !productVariantItem) {
      const Price = productItem.discountedPrice;
      const Quantity = quantity;
      totalPrice = Price * Quantity;

      shippingPrice += productItem.shippingPrice;

      console.log("I am here to go", totalPrice, shippingPrice);
    }
    // else if type is rent and product does not have variants (diffent color different size etc etc)
    else if (productType === "rent" && !!productVariantItem) {
      const Price = productVariantItem.rentingPrice;
      const Quantity = quantity;
      const RentDays = cartItem.rentDays;
      totalPrice = Price * Quantity * RentDays;

      shippingPrice += productVariantItem.shippingPrice;
    }
    // else if type is rent and product does not have variants (diffent color different size etc etc)
    else if (productType === "rent" && !productVariantItem) {
      const Price = productItem.rentingPrice;
      const Quantity = quantity;
      const RentDays = cartItem.rentDays;
      totalPrice = Price * Quantity * RentDays;

      shippingPrice += productVariantItem.shippingPrice;
    }

    const paymentObject = {
      amount: totalPrice,
      productinfo: [Title],
    };

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

    const user = await User.findById(req.user._id);

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

    const orderGroupID = uuidv4();

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
        orderGroupID,
        address,
        user: req.user._id.toString(),
        // center: centerAddresses[0]._id.toString(),
        cartProductIds: "",
        productIds: productItem._id.toString(),
      },
    });

    let orderItemsWithOrderIDandPaymentId;

    if (productType === "buy") {
      orderItemsWithOrderIDandPaymentId = {
        ...productItem,

        product: productItem._id,
        user: req.user._id,

        // order related
        orderGroupID: orderGroupID,
        paymentTxnId: paymentIntent.id,

        // product details
        title: productItem.title,

        quantity: quantity,
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

      if (!!productVariantItem) {
        orderItemsWithOrderIDandPaymentId.previewImage =
          productVariantItem.previewImage;
        orderItemsWithOrderIDandPaymentId.price =
          productVariantItem.discountedPrice * item.quantity;
        orderItemsWithOrderIDandPaymentId.shippingPrice =
          +productVariantItem.shippingPrice;

        orderItemsWithOrderIDandPaymentId.color = productVariantItem.color;
        orderItemsWithOrderIDandPaymentId.size = productVariantItem.size;
      } else {
        orderItemsWithOrderIDandPaymentId.previewImage =
          productItem.previewImage;
        orderItemsWithOrderIDandPaymentId.price =
          productItem.discountedPrice * quantity;
        orderItemsWithOrderIDandPaymentId.shippingPrice =
          +productItem.shippingPrice;

        orderItemsWithOrderIDandPaymentId.color = null;
        orderItemsWithOrderIDandPaymentId.size = null;
      }
    }

    console.log("Created At -->", orderItemsWithOrderIDandPaymentId);

    const order = await Order.create(orderItemsWithOrderIDandPaymentId);

    await PaymentTransModel.create({
      orderGroupID,
      paymentTransactionID: paymentIntent.id,
      user: req.user._id,
      order: [order._id],

      // initial status of payment
      paymentStatus: "Pending",

      // PRICE related keys
      shippingPrice: !!shippingApplied ? shippingPrice : 0,
      subTotalPrice:
        paymentObject.amount / 100 - (!!shippingApplied ? shippingPrice : 0),
      totalPrice: paymentObject.amount / 100,
    });

    res.json({
      paymentTxnId: paymentIntent.id,
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
