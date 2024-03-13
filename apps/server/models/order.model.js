const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    previewUrl: { type: String },
    title: { type: String, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number },
    shippingPrice: { type: Number, default: 0 },
    orderType: { type: String, required: true, enum: ["buy", "rent"] },
    rentDays: { type: Number, default: null },
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: Boolean, default: false },
    trackingLink: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

module.exports = Order;
