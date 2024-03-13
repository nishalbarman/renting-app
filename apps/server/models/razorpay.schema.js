const mongoose = require("mongoose");

const razorpayOrderIdSchema = new mongoose.Schema({
  razorPayOrderId: { type: String, required: true },
  order: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
});

const RazorPayOrder =
  mongoose.models.razorpay_orderids ||
  mongoose.model("razorpay_orderids", razorpayOrderIdSchema);

module.exports = RazorPayOrder;
