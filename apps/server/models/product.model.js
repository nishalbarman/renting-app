const mongoose = require("mongoose");
const {
  hasOneSpaceBetweenNames,
  isValidEmail,
  isValidIndianMobileNumber,
  isValidUrl,
} = require("validator");

const productSchema = new mongoose.Schema(
  {
    previewUrl: { type: String, required: true },
    title: { type: String, required: true },

    category: { type: mongoose.Types.ObjectId, ref: "categories" },

    showPictures: { type: Array, required: true }, // images array
    description: { type: String, required: true },
    stars: { type: Number, default: 0 },
    totalFeedbacks: { type: Number, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    availableStocks: { type: Number, required: true, default: 0 },

    discountedPrice: { type: Number, required: true }, // if no varient is available then default price would be this
    originalPrice: { type: Number }, // if no varient is available then default price would be this

    isVarientAvailable: { type: Boolean, default: false },
    productVarient: [
      // if there is a varient for this product then the price will be taken from varient object
      { type: mongoose.Types.ObjectId, ref: "product_verients" },
    ],

    // isSizeVaries: { type: Boolean, default: false },
    // isColorVaries: { type: Boolean, default: false },
    // availableSizes: [{ type: mongoose.Types.ObjectId, ref: "product_sizes" }],
    // availableColors: [{ type: mongoose.Types.ObjectId, ref: "product_colors" }],
  },
  {
    timestamps: true,
    query: {
      withQuery(query) {
        return this.where(query);
      },
      withPagination(query = {}, limit = 20, skip) {
        return this.where(query)
          .sort({ createdAt: "desc" })
          .skip(skip)
          .limit(limit);
      },
    },
  }
);

const productVarientSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: "products" },
    size: { type: mongoose.Types.ObjectId, ref: "product_sizes" },
    color: { type: mongoose.Types.ObjectId, ref: "product_colors" },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

const ProductVarient =
  mongoose.models.product_varients ||
  mongoose.model("product_varients", productVarientSchema);

// ----------------------------------------->
/****************************************** */
/**        Product Schema Validator        **/
/****************************************** */
// ----------------------------------------->

Product.schema.path("previewUrl").validate({
  validator: (value) => value && isValidUrl(value),
  message: "Invalid Preview URL",
});

Product.schema.path("discountedPrice").validate({
  validator: (value) => value && !isNaN(parseFloat(value)) && value > 0,
  message: "Discounted Price must be non zero number",
});

Product.schema.path("showPictures").validate({
  validator: (value) => value && value.length == 4,
  message: "Show pictures must contain atleast 4 images",
});

// ProductVarient.schema.path("product").validate({
//   validator: (value) => value && value.length >= 4,
//   message: "varient should have proper product id",
// });

ProductVarient.schema.path("discountedPrice").validate({
  validator: (value) => value && !isNaN(parseFloat(value)) && value > 0,
  message: "Discounted Price must be non zero number,",
});

module.exports = productSchema;
