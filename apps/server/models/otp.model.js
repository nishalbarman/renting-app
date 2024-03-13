const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobileNo: { type: String },
    otp: { type: String, required: true },
    // dueTime: { type: Date, default: Date.now()},
  },
  {
    timestamps: true,
  }
);

const Otp =
  mongoose.models.registration_otp ||
  mongoose.model("registration_otp", otpSchema);

module.exports = Otp;
