const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Color =
  mongoose.models.product_colors ||
  mongoose.model("product_colors", colorSchema);

module.exports = Color;
