const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Types.ObjectId, ref: "products" },

    // isVariantAvailable: { type: Boolean, required: true, default: false },
    variant: { type: mongoose.Types.ObjectId, ref: "product_variants" },

    quantity: { type: Number, default: 1 },

    rentDays: { type: Number, default: 2 },

    productType: { type: String, enum: ["buy", "rent"], required: true },

    // size: { type: String, required: false },
    // color: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.cart || mongoose.model("cart", cartSchema);

module.exports = Cart;
