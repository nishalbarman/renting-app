const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    paymentTxnId: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },

    product: { type: mongoose.Types.ObjectId, ref: "products" },

    previewUrl: { type: String },
    title: { type: String, required: true },

    // pricing
    price: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },

    // variant related info
    color: { type: String, required: false },
    size: { type: String, required: false },
    quantity: { type: Number, default: null },

    address: { type: Object, default: null, required: false },

    orderType: { type: String, required: true, enums: ["buy", "rent"] },

    // status related
    orderStatus: {
      type: String,
      default: "Pending",
      enums: [
        "Pending",
        "Accepted",
        "Cancelled",
        "Dispatched",
        "On your way",
        "Delivered",
      ],
    },

    paymentStatus: {
      type: String,
      default: "Pending",
      enums: ["Success", "Failed", "Pending"],
    },

    // renting related
    rentDays: { type: Number, required: false, default: undefined },

    //
    rentReturnDueDate: { type: Date, default: null },

    shipmentType: {
      type: String,
      required: false,
      enums: ["self_pickup", "through_partner"],
      default: "self_pickup",
    },

    pickupDate: { type: Date, requied: false, default: null },
    pickupCenter: { type: Object, required: false, default: null },

    // tracking link for the order track
    trackingLink: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

module.exports = Order;
