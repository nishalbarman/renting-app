const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  redirectPath: { type: String, required: true },
});

const Category =
  mongoose.models.categories || mongoose.model("categories", categorySchema);

module.exports = Category;
