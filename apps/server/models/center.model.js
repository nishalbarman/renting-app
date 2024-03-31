const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    centerName: { type: String, required: true },
    houseImage: { type: String, required: true },
    addressProofImage: { type: String, required: true },
    idProofImage: { type: String, required: true },
    address: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "addresses",
    },
  },
  {
    timestamps: true,
  }
);

const Center =
  mongoose.models.center_details ||
  mongoose.model("center_details", centerSchema);

module.exports = Center;
