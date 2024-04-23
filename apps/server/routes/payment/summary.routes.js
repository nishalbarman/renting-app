const express = require("express");
const router = express.Router();

const { globalErrorHandler } = require("../../helpter/globalErrorHandler");
const checkRole = require("../../middlewares");

const PaymentTransModel = require("../../models/transaction.model");

router.get("/:orderGroupId", checkRole(1), async (req, res) => {
  try {
    const orderGroupId = req.params?.orderGroupId;

    if (!orderGroupId) {
      return res.status(400).json({ message: "Order Group ID missing" });
    }

    const paymentTransaction = await PaymentTransModel.findOne({
      orderGroupID: orderGroupId,
    }).select("paymentStatus subTotalPrice shippingPrice totalPrice");

    console.log(paymentTransaction);

    return res.status(200).json({
      paymentStatus: paymentTransaction.paymentStatus,
      subTotalPrice: paymentTransaction.subTotalPrice,
      shippingPrice: paymentTransaction.shippingPrice,
      totalPrice: paymentTransaction.totalPrice,
    });
  } catch (error) {
    globalErrorHandler(res, error);
  }
});

module.exports = router;
