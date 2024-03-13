const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const Product = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { isValidUrl } = require("validator");

const TAG = "products/route.js:--";

router.get("/", async (req, res) => {
  try {
    const searchParams = req.query;

    const PAGE = searchParams.page || 1;
    const LIMIT = searchParams.limit || 50;
    const SKIP = (PAGE - 1) * LIMIT;

    const products = await Product.find({})
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    return res.status(200).json({ data: products, status: true });
  } catch (error) {
    console.error(TAG, error);
    return res
      .status(500)
      .json({ message: "Some error occurred", status: false });
  }
});

router.post("/", async (req, res) => {
  try {
    const userToken = req.cookies.token || null;
    const token = userToken?.token;
    if (!token) {
      return res.redirect("/auth/login");
    }

    const userDetails = getTokenDetails(token);
    if (!userDetails || !userDetails?.role || userDetails.role !== 1) {
      return res.redirect("/auth/login");
    }

    const reqBody = req.body;

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
        !(
          ObjectId.isValid(category) &&
          String(new ObjectId(category)) === category
        )
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

    if (reqBody.productList) {
      // multi-product is received
      // TODO: validate multi-products and do whatever is needed
      const errorProductList = [];
      const validProducts = reqBody.productList.filter(
        (singleProduct, index) => {
          const errorObject = {};
          const error = isProductHasError(singleProduct);
          if (error.length > 0) {
            errorObject.message = error.join(", ");
            errorObject.index = index;
            errorProductList.push(errorObject);
          } else {
            return singleProduct;
          }
        }
      );

      await Product.insertMany(validProducts);
      return res.status(200).json({
        message: "Products created",
        error: errorProductList.length > 0 ? errorProductList : undefined,
      });
    }

    const error = isProductHasError(reqBody);
    if (error.length > 0) {
      return res.status(400).json({ message: error.join(", ") });
    }

    const product = new Product(reqBody);
    await product.save();

    return res.status(200).json({ message: "Product created", status: true });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message, status: false });
  }
});

module.exports = router;
