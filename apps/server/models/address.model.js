const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    name: { type: String, required: true },
    locality: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    streetName: { type: String, required: true },
    city: { type: String },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type
        required: true,
      },
      coordinates: {
        type: [Number], // Array of [longitude, latitude]
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

addressSchema.index({ location: "2dsphere" });

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

module.exports = Address;
