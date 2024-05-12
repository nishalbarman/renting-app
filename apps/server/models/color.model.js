const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
});

const Color =
  mongoose.models.product_colors || mongoose.model("colors", colorSchema);

module.exports = Color;
