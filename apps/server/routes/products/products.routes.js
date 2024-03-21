const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const { Product } = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { isValidUrl } = require("validator");
const Order = require("../../models/order.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");

const TAG = "products/route.js:--";

// product validation function, so we can determine an product has valid or invalid data
const isProductHasError = ({
  previewUrl,
  title,
  category,
  discountedPrice,
  originalPrice,
  showPictures,
  description,
  shippingPrice,
  availableStocks,
  isSizeVaries,
  isColorVaries,
  availableSizes,
  availableColors,
}) => {
  const error = [];
  if (!isValidUrl(previewUrl)) {
    error.push("preview image is not valid");
  }

  if (!title || title.length < 7) {
    error.push("title should be of minimum 7 characters");
  }

  const ObjectId = mongoose.Types.ObjectId;
  if (
    !category ||
    !(ObjectId.isValid(category) && String(new ObjectId(category)) === category)
  ) {
    error.push("select a valid category");
  }

  if (!discountedPrice && !originalPrice) {
    error.push("price needs to be given");
  }

  if (
    !!discountedPrice &&
    !!originalPrice &&
    originalPrice <= discountedPrice
  ) {
    error.push("discounted price should be lesser than original price");
  }

  if (!Array.isArray(showPictures)) {
    error.push("pictures should be an array");
  }

  try {
    const html = cheerio.load(description);
  } catch (error) {
    error.push("description is not valid html");
  }

  if (!!shippingPrice && isNaN(parseInt(shippingPrice))) {
    error.push("shipping price should be a valid number");
  }

  if (!!availableStocks && isNaN(parseInt(availableStocks))) {
    error.push("stock should be a valid number");
  }

  if (
    !!isSizeVaries &&
    (!Array.isArray(availableSizes) ||
      !availableSizes.every((obj) => typeof obj === "object"))
  ) {
    error.push(
      "available sizes should be an array of objects, each with a size and price"
    );
  }

  if (
    !!isColorVaries &&
    (!Array.isArray(availableColors) ||
      !availableColors.every((color) => typeof color === "object"))
  ) {
    error.push(
      "available colors should be an array of objects, each with a color and price"
    );
  }

  return error;
}; // validator function

router.get("/", async (req, res) => {
  try {
    const searchParams = req.query;

    const PAGE = searchParams.page || 1;
    const LIMIT = searchParams.limit || 50;
    const SKIP = (PAGE - 1) * LIMIT;

    // filter result by query params
    const TYPE = searchParams?.productType;
    const CATEGORY = searchParams?.category;

    const filter = {}; // blank filter object

    if (TYPE) {
      filter.productType = TYPE;
    }

    if (CATEGORY) {
      filter.category = CATEGORY;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    console.log(products);

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: "Some error occurred" });
  }
});

router.get("/view/:productId", async (req, res) => {
  try {
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const userDetails = getTokenDetails(token);

    console.log(TAG, userDetails);

    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const params = req.params;
    console.log(TAG, params);

    // check whether we have the product id or not
    if (!params.productId) {
      return res
        .status(400)
        .json({ redirect: "/products", message: "Product ID missing!" });
    }

    const product = await Product.findOne({ _id: params.productId }).populate([
      "category",
      { path: "productVariant", populate: ["size", "color"] },
    ]);
    const doesUserBoughtThisProduct = await Order.countDocuments({
      product: params.productId,
      user: userDetails._id,
    });

    console.log(TAG, product);
    if (!product) {
      return res.status(404).json({ message: "No such product found." });
    }

    return res.status(200).json({ product, doesUserBoughtThisProduct });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// product create route, admin can create products
router.post("/", async (req, res) => {
  try {
    const token = req?.jwt?.token || null;
    if (!token) {
      return res.redirect("/auth/login");
    }

    const userDetails = getTokenDetails(token);
    if (!userDetails || !userDetails?.role || userDetails.role !== 1) {
      return res.redirect("/auth/login");
    }

    const reqBody = req.body;

    // if the key products in request object is missing or it is not an array then return false
    if (!reqBody?.products || !Array.isArray(reqBody?.products)) {
      return res.status(400).json({ message: "Expected an array!" });
    }

    // validate recieved products and filter out valid products and insert them on database
    const errorProductList = [];
    const validProducts = reqBody.productList.filter((singleProduct, index) => {
      const errorObject = {};
      const error = isProductHasError(singleProduct); // validate the product
      if (error.length > 0) {
        errorObject.message = error.join(", ");
        errorObject.index = index;
        errorProductList.push(errorObject);
        return false; // false as product does not has valid data
      } else {
        return true; // true as product has valid data
      }
    });

    // insert into database
    await Product.insertMany(validProducts);

    return res.status(200).json({
      message: `Product${req?.products?.length > 1 && "'s"} created`,
      error: errorProductList.length > 0 ? errorProductList : undefined,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
