const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  off: { type: Number, required: true },
  isPercentage: { type: Boolean, required: true },
  description: { type: String, required: true },
});

const Coupon =
  mongoose.models.coupons || mongoose.model("coupons", couponSchema);

module.exports = Coupon;
