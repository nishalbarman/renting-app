const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Size =
  mongoose.models.product_sizes || mongoose.model("sizes", sizeSchema);

module.exports = Size;
