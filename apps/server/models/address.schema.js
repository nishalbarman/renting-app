const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    address_1: { type: String, required: true },
    address_2: { type: String, default: "" },
    pincode: { type: Number, required: true },
    state: { type: Boolean, default: false },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

module.exports = Address;
