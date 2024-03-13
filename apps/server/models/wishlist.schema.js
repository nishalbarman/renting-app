const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Types.ObjectId, ref: "products" },
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;
