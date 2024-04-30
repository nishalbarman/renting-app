const mongoose = require("mongoose");
const {
  hasOneSpaceBetweenNames,
  isValidEmail,
  isValidIndianMobileNumber,
  isValidUrl,
} = require("custom-validator-renting");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerfied: { type: Boolean, default: false },
    emailVerifyToken: { type: String, default: "" },
    isMobileNoVerified: { type: Boolean, default: true },
    // mobileNoVerifyToken: { type: String, default: "" },
    resetToken: { type: String, default: "" },
    role: { type: mongoose.Types.ObjectId, ref: "roles" }, // 0 means normal user, 1 means admin, 2 means seller
    // address: [{ type: mongoose.Types.ObjectId, ref: "addresses" }],
    defaultSelectedAddress: { type: mongoose.Types.ObjectId, ref: "addresses" },

    // center related field
    center: { type: mongoose.Types.ObjectId, ref: "center_details" },

    stripeCustomer: { type: Object, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

// ----------------------------------------->
/****************************************** */
/**          User Schema Validator         **/
/****************************************** */
// ----------------------------------------->

User.schema.path("name").validate({
  validator: (value) => value && hasOneSpaceBetweenNames(value),
  message: "Full name required with space in between first and lastname",
});

User.schema.path("email").validate({
  validator: (value) => value && isValidEmail(value),
  message: "Provided email address is not valid",
});

User.schema.path("email").validate({
  validator: async (value) => {
    const count = await User.findOne({ email: value }).count();
    return count === 0;
  },
  message: "An account with the given email address is already available",
});

User.schema.path("mobileNo").validate({
  validator: (value) => value && isValidIndianMobileNumber(value),
  message: "Provided mobile no is not valid",
});

module.exports = User;
