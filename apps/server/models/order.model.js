const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },

    previewUrl: { type: String },
    title: { type: String, required: true },

    // pricing
    price: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },

    // variant related info
    color: { type: String, required: false },
    size: { type: String, required: false },
    quantity: { type: Number, default: null },

    orderType: { type: String, required: true, enums: ["buy", "rent"] },

    // status related keys
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: Boolean, default: false },

    // renting related keys
    rentDays: { type: Number, default: null },
    rentReturnDueDate: { type: Date, default: null },

    // tracking link for the order track
    trackingLink: { type: String, default: null },

    product: { type: mongoose.Types.ObjectId, ref: "products" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

module.exports = Order;
