const mongoose = require("mongoose");
const {
  hasOneSpaceBetweenNames,
  isValidEmail,
  isValidIndianMobileNumber,
  isValidUrl,
} = require("validator");

/****************************************** */
/**              Schema Starts             **/
/****************************************** */

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerfied: { type: Boolean, default: false },
    emailVerifyToken: { type: String, default: "" },
    isMobileNoVerified: { type: Boolean, default: false },
    mobileNoVerifyToken: { type: String, default: "" },
    resetToken: { type: String, default: "" },
    role: { type: mongoose.Types.ObjectId, ref: "roles" }, // 0 means normal user, 1 means admin, 2 means seller
    address: { type: mongoose.Types.ObjectId, ref: "addresses", default: null },
  },
  {
    timestamps: true,
  }
);

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    address_1: { type: String, required: true },
    address_2: { type: String, default: "" },
    pincode: { type: Number, required: true },
    state: { type: Boolean, default: false },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const otpSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    mobileNo: { type: String },
    otp: { type: String, required: true },
    dueTime: { type: Date, default: Date.now() + 10 * 60 * 1000 },
  },
  {
    timestamps: true,
  }
);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    altText: { type: String, required: true },
    description: { type: String, required: true },
    redirect: { type: String, required: true },
  },
  {
    timestamps: true,
    query: {
      all() {
        return this.where({});
      },
    },
  }
);

const feedbackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    stars: { type: Number, default: 0 },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    query: {
      all() {
        return this.where({});
      },
    },
  }
);

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  path: { type: String, required: true },
});

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

const productVarientSchema = new mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "products" },
  size: { type: mongoose.Types.ObjectId, ref: "product_sizes" },
  color: { type: mongoose.Types.ObjectId, ref: "product_colors" },
  discountedPrice: { type: Number, required: true },
  originalPrice: { type: Number },
});

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

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Types.ObjectId, ref: "products" },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    previewUrl: { type: String },
    title: { type: String, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number },
    shippingPrice: { type: Number, default: 0 },
    orderType: { type: String, required: true, enum: ["buy", "rent"] },
    rentDays: { type: Number, default: null },
    orderStatus: { type: String, default: "Pending" },
    paymentStatus: { type: Boolean, default: false },
    trackingLink: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// const couponSchema = new mongoose.Schema({
//   code: { type: String, required: true },
//   off: { type: Number, required: true },
//   isPercentage: { type: Boolean, required: true },
//   description: { type: String, required: true },
// });

const razorpayOrderIdSchema = new mongoose.Schema({
  razorPayOrderId: { type: String, required: true },
  order: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
});

const sizeSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const colorSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const paymentGatewaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true, required: true },
});

// ----------------------------------------->
/****************************************** */
/**            Mongoose Models             **/
/****************************************** */
// ----------------------------------------->

const User = mongoose.models.users || mongoose.model("users", userSchema);

const Coupon =
  mongoose.models.coupons || mongoose.model("coupons", couponSchema);

const Role = mongoose.models.roles || mongoose.model("roles", roleSchema);

const Otp =
  mongoose.models.registration_otp ||
  mongoose.model("registration_otp", otpSchema);

const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

const Banner =
  mongoose.models.banners || mongoose.model("banners", bannerSchema);

const Category =
  mongoose.models.categories || mongoose.model("categories", categorySchema);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

const Feedback =
  mongoose.models.feedbacks || mongoose.model("feedbacks", feedbackSchema);

const Cart = mongoose.models.cart || mongoose.model("cart", cartSchema);

const Wishlist =
  mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

const Size =
  mongoose.models.product_sizes || mongoose.model("product_sizes", sizeSchema);

const Color =
  mongoose.models.product_colors ||
  mongoose.model("product_colors", colorSchema);

const ProductVarient =
  mongoose.models.product_varients ||
  mongoose.model("product_varients", productVarientSchema);

const RazorPayOrder =
  mongoose.models.razorpay_orderids ||
  mongoose.model("razorpay_orderids", razorpayOrderIdSchema);

const PaymentGateway =
  mongoose.models.paymentgateways ||
  mongoose.model("paymentgateways", paymentGatewaySchema);

// ----------------------------------------->
/****************************************** */
/**          User Schema Validator         **/
/****************************************** */
// ----------------------------------------->

User.schema.path("name").validate({
  validator: (value) => value && hasOneSpaceBetweenNames(value),
  message: "Full name required with space in between first and lastname",
});

User.schema.path("email").validate({
  validator: (value) => value && isValidEmail(value),
  message: "Email Invalid",
});

User.schema.path("email").validate({
  validator: async (value) => {
    const count = await User.findOne({ email: value }).count();
    return count === 0;
  },
  message: "Email already exist",
});

User.schema.path("mobileNo").validate({
  validator: (value) => value && isValidIndianMobileNumber(value),
  message: "MobileNo Invalid",
});

// ----------------------------------------->
/****************************************** */
/**        Messages Schema Validator       **/
/****************************************** */
// ----------------------------------------->

Message.schema.path("name").validate({
  validator: function (value) {
    return value.length > 2;
  },
  message: "name required",
});

Message.schema.path("email").validate({
  validator: function (value) {
    var tester =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return value && tester.test(value);
  },
  message: "enter valid email!",
});

Message.schema.path("message").validate({
  validator: function (value) {
    return value.length > 10;
  },
  message: "Message minimum length should be 10 characters",
});

Message.schema.path("phone").validate({
  validator: function (value) {
    return value.toString().length === 10;
  },
  message: "phone number must be of 10 digit",
});

// ----------------------------------------->
/****************************************** */
/**        Banner Schema Validator         **/
/****************************************** */
// ----------------------------------------->

Banner.schema.path("imageUrl").validate({
  validator: function (value) {
    return value && isValidUrl(value);
  },
  message: "Invalid Url",
});

Banner.schema.path("redirect").validate({
  validator: function (value) {
    return value && value.includes("/");
  },
  message: "Invalid Link",
});

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

/***************************************** */

module.exports = {
  User,
  Role,
  Message,
  Otp,
  Banner,
  Category,
  Product,
  Feedback,
  Cart,
  Wishlist,
  Address,
  Order,
  Coupon,
  Size,
  Color,
  RazorPayOrder,
  PaymentGateway,
  ProductVarient,
};
