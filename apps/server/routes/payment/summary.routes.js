const express = require("express");
const router = express.Router();

const { globalErrorHandler } = require("../../helpter/globalErrorHandler");
const checkRole = require("../../middlewares");

const PaymentTransModel = require("../../models/stripe.model");

router.get("/:paymentTransactionId", checkRole(1), async (req, res) => {
  try {
    const paymentTransactionId = req.params?.paymentTransactionId;

    if (!paymentTransactionId) {
      return res.status(400).json({ message: "Transaction ID missing" });
    }

    const paymentTransaction = PaymentTransModel.findOne(
      paymentTransactionId
    ).select("paymentStatus subTotalPrice shippingPrice totalPrice");

    return res.status(200).json({
      PaymentStatus: paymentTransaction.PaymentStatus,
      subTotalPrice: paymentTransaction.subTotalPrice,
      shippingPrice: paymentTransaction.shippingPrice,
      totalPrice: paymentTransaction.totalPrice,
    });
  } catch (error) {
    globalErrorHandler(res, error);
  }
});

module.exports = router;
