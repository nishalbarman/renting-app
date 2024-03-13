const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  path: { type: String, required: true },
});

const Category =
  mongoose.models.categories || mongoose.model("categories", categorySchema);

module.exports = Category;
