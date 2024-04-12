const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    centerName: { type: String, required: true },
    centerImage: { type: String, required: true },
    addressProofImage: { type: String, required: true },
    idProofImage: { type: String, required: true },
    address: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "addresses",
    },
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

centerSchema.index({ location: "2dsphere" });

const Center =
  mongoose.models.center_details ||
  mongoose.model("center_details", centerSchema);

module.exports = Center;
