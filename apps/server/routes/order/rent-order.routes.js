const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");

const checkRole = require("../../middlewares");
const PaymentTransModel = require("../../models/transaction.model");

// const Coupon = require("../../../../models/coupon.model");

//! CURRENTLY NOT IN USE
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

router.post("/:productType", checkRole(0), async (req, res) => {
  try {
    // const token = req?.jwt?.token;

    // if (!token) {
    //   return res.status(401).json({ message: "No auth token provided" });
    // }

    // const userDetails = getTokenDetails(token);

    // if (!userDetails) {
    //   return res.status(401).json({ message: "Authorization failed" });
    // }

    const productType = req.params?.productType;

    if (!productType) {
      return res.status(400).json({ message: "Product Type Not Found" });
    }

    const centerId = req.query?.centerId;

    if (!centerId) {
      return res.status(400).json({ message: "Center not selected" });
    }

    // TODO: May be usefull in future time
    // const address = req.body?.address;

    // if (!address) {
    //   return res.status(400).json({ message: "Address missing" });
    // }

    // const appliedCouponID = req?.query?.coupon;

    const cartItemsForUser = await Cart.find({
      user: req.user._id,
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

    // if (!!appliedCouponID) {
    //   const appliedCoupon = await Coupon.findOne({ _id: appliedCouponID });

    //   if (!!appliedCoupon) {
    //     const discountedPrice = appliedCoupon?.isPercentage
    //       ? (paymentObject.amount / 100) * parseInt(appliedCoupon.off) || 0
    //       : paymentObject.amount >
    //           (appliedCoupon.minimumPayAmount || paymentObject.amount + 100)
    //         ? appliedCoupon.off
    //         : 0;

    //     paymentObject.amount -= discountedPrice;
    //   }
    // }

    const freeDeliveryAboveMinimumPurchase = true;
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

    const paymentTransactionID = "RNT-" + uuidv4();

    const orderGroupID = uuidv4();

    let txnAndOrderIdInsertedCartItems;

    txnAndOrderIdInsertedCartItems = cartItemsForUser.map((item) => {
      const createdOrder = {
        ...item,

        product: item.product._id,
        user: req.user._id,

        // order related
        orderGroupID: orderGroupID,
        paymentTxnId: paymentTransactionID,

        // product details
        title: item.product.title,

        quantity: item.quantity,
        rentDays: item.rentDays,
        orderType: "rent",

        address: null, // TODO: Maybe later on we can add the address as well for now its not needed

        center: centerId,

        orderStatus: "On Hold",
        paymentMode: "COC",
        shipmentType: "self_pickup",
      };

      if (!!item.variant) {
        createdOrder.previewImage = item.variant.previewImage;
        createdOrder.price =
          item.variant.rentingPrice * item.rentDays * item.quantity;
        // createdOrder.shippingPrice = item.variant.shippingPrice;

        createdOrder.color = item.variant.color;
        createdOrder.size = item.variant.size;
      } else {
        createdOrder.previewImage = item.product.previewImage;
        createdOrder.price =
          item.variant.rentingPrice * item.rentDays * item.quantity;
        // createdOrder.shippingPrice = item.product.shippingPrice;

        createdOrder.color = null;
        createdOrder.size = null;
      }

      return createdOrder;
    });

    // insert order for user
    const orders = await Order.insertMany(txnAndOrderIdInsertedCartItems);
    if (!!orders) {
      // const cartRemoved = await Cart.deleteMany({
      //   user: userDetails._id,
      //   productType: productType,
      // });

      await PaymentTransModel.create({
        orderGroupID,
        paymentTransactionID: paymentTransactionID,
        user: req.user._id,
        order: orders.map((item) => item._id),

        //! Status of Payment
        paymentStatus: "COC",

        //! PRICE related keys
        shippingPrice: !!shippingApplied ? shippingPrice : 0,
        subTotalPrice:
          paymentObject.amount / 100 - (!!shippingApplied ? shippingPrice : 0),
        totalPrice: paymentObject.amount / 100,
      });

      return res.status(200).json({ message: "Order Placed!" });
    }

    return res.status(200).json({ message: "Order Could Not Be Placed!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

//! CURRENTLY NOT IN USE
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
