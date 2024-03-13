const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Types.ObjectId, ref: "products" },

    quantity: { type: Number, default: 1 },

    size: {
      type: mongoose.Types.ObjectId,
      ref: "product_sizes",
      default: "65ccbb46bd028c8adafdd971",
    },

    color: {
      type: mongoose.Types.ObjectId,
      ref: "product_colors",
      default: "65ccbb46bd028c8adafdd971",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.cart || mongoose.model("cart", cartSchema);

module.exports = Cart;
