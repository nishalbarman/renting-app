const mongoose = require("mongoose");
const {
  hasOneSpaceBetweenNames,
  isValidEmail,
  isValidIndianMobileNumber,
  isValidUrl,
} = require("custom-validator-renting");

const productSchema = new mongoose.Schema(
  {
    previewImage: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      default: "65f6c9f882ba818ab0e43d64",
    },
    slideImages: { type: Array, required: true }, // images array
    description: { type: String, required: true },

    stars: { type: Number, default: 0 },
    totalFeedbacks: { type: Number, default: 0 },

    rentTotalOrders: { type: Number, default: 0 },
    buyTotalOrders: { type: Number, default: 0 },

    // isPurchasable: { type: Boolean, default: false },
    // isRentable: { type: Boolean, default: false },
    productType: {
      type: String,
      enums: ["rent", "buy", "both"],
      required: true,
    },

    shippingPrice: { type: Number, required: true, default: 0 },
    availableStocks: { type: Number, required: true, default: 0 },
    rentingPrice: { type: Number, required: true }, // if no varient is available then default renting price would be this
    discountedPrice: { type: Number, required: true }, // if no varient is available then default price would be this
    originalPrice: { type: Number }, // if no varient is available then default price would be this

    isVariantAvailable: { type: Boolean, default: false },
    productVariant: {
      type: [mongoose.Types.ObjectId],
      ref: "product_variants",
    },
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

productSchema.index({
  title: "text",
  description: "text",
  shippingPrice: "text",
  rentingPrice: "text",
});

const productVariantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: "products" },

    previewImage: { type: String, required: true },
    slideImages: { type: [String], required: true }, // images array

    size: { type: String, required: true },
    color: { type: String, required: true },

    availableStocks: { type: Number, required: true },

    shippingPrice: { type: Number, required: true },
    rentingPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

Product.createSearchIndex;

const ProductVariant =
  mongoose.models.product_varients ||
  mongoose.model("product_variants", productVariantSchema);

// ----------------------------------------->
/****************************************** */
/**        Product Schema Validator        **/
/****************************************** */
// ----------------------------------------->

Product.schema.path("previewImage").validate({
  validator: (value) => !!value,
  // && isValidUrl(value)
  message: "Invalid Preview Image Url",
});

Product.schema.path("discountedPrice").validate({
  validator: (value) => value && !isNaN(parseFloat(value)) && value > 0,
  message: "Discounted Price must be non zero number",
});

Product.schema.path("slideImages").validate({
  validator: (value) => value && value.length >= 1,
  message: "Slide Images must contain atleast 1 images",
});

// ProductVarient.schema.path("product").validate({
//   validator: (value) => value && value.length >= 4,
//   message: "varient should have proper product id",
// });

ProductVariant.schema.path("discountedPrice").validate({
  validator: (value) => value && !isNaN(parseFloat(value)) && value > 0,
  message: "Discounted Price must be non zero number,",
});

module.exports = { Product, ProductVariant };
