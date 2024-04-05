const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    paymentTxnId: { type: String, required: false },
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
      default: "On Hold",
      enums: [
        "On Hold",
        "Pending",
        "On Progress",
        "Accepted",
        "Rejected",
        "Cancelled",
        "On The Way",
        "PickUp Ready",
        "Delivered",
      ],
    },

    paymentStatus: {
      type: String,
      default: "Pending",
      enums: ["Success", "Failed", "Pending"],
    },

    shipmentType: {
      type: String,
      required: false,
      enums: ["self_pickup", "delivery_partner"],
      default: "self_pickup",
    },

    // renting related
    rentDays: { type: Number, required: false, default: undefined },

    pickupDate: { type: Date, requied: false, default: null },
    pickupCenter: { type: Object, required: false, default: null },

    rentPickedUpDate: { type: Date, requied: false, default: null },
    rentReturnDueDate: { type: Date, default: null },

    // tracking link for the order track
    trackingLink: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

module.exports = Order;
