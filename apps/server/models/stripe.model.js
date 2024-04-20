const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  paymentTransactionID: { type: String, required: true },
  order: { type: [mongoose.Types.ObjectId], ref: "orders" },
  user: { type: mongoose.Types.ObjectId, required: true },

  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"] },

  subTotalPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const PaymentTransModel =
  mongoose.models.payment_transactions ||
  mongoose.model("payment_transactions", transactionSchema);

module.exports = PaymentTransModel;
