const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    locality: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: Number, required: true },
    streetName: { type: Boolean, required: true },
    city: { type: String, required: true },
    longitude: { type: String, required: true },
    laititude: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

module.exports = Address;
