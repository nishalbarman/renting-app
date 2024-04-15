const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    categoryImageUrl: { type: String, required: true },
    categoryKey: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.categories || mongoose.model("categories", categorySchema);

module.exports = Category;
