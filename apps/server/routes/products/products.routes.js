const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const { Product, ProductVariant } = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { isValidUrl } = require("custom-validator-renting");
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
    const QUERY = searchParams?.query;

    const filter = {}; // blank filter object

    if (QUERY) {
      filter["$text"] = { $search: QUERY };
    }

    if (TYPE) {
      filter.productType = TYPE;
    }

    if (CATEGORY) {
      filter.category = CATEGORY;
    }

    const totalProductsCount = await Product.countDocuments(
      filter,
      !!QUERY ? { score: { $meta: "textScore" } } : undefined
    );
    const products = await Product.find(filter)
      .sort(!!QUERY ? { score: { $meta: "textScore" } } : { createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    const toalPages = Math.ceil(totalProductsCount / LIMIT);

    return res.status(200).json({ toalPages, data: products });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/view/:productId", async (req, res) => {
  try {
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const userDetails = getTokenDetails(token);

    // console.log(TAG, userDetails);

    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const params = req.params;
    const productType = req.body?.productType;

    if (!productType) {
      return res
        .status(400)
        .json({ redirect: "/products", message: "Product Type missing!" });
    }

    // check whether we have the product id or not
    if (!params.productId) {
      return res
        .status(400)
        .json({ redirect: "/products", message: "Product ID missing!" });
    }

    const product = await Product.findOne({ _id: params.productId }).populate([
      "category",
      { path: "productVariant" },
    ]);

    console.log("has user bought", {
      product: params.productId,
      user: userDetails._id,
      orderType: productType,
      orderStatus: "Delivered",
    });

    const hasUserBoughtThisProduct = await Order.countDocuments({
      product: params.productId,
      user: userDetails._id,
      orderType: productType,
      orderStatus: "Delivered",
    });

    if (!product) {
      return res.status(404).json({ message: "No such product found." });
    }

    return res.status(200).json({
      product,
      hasUserBoughtThisProduct: !!hasUserBoughtThisProduct,
    });
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

// product instock check
router.post("/variant/instock/:productId", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({ message: "Authorization failed" });
    }

    const searchParams = req.params;
    const body = req.body;

    // console.log("+----------------+");
    // console.log(body);
    // console.log("+----------------+");

    let inStock = false;

    if (body?.variant) {
      const Variant = await ProductVariant.findOne({
        _id: body.variant,
      });
      // console.log(Variant);
      inStock = !!Variant && Variant?.availableStocks > 0;
      // console.log("In stock --> ", inStock);
      return res.json({
        inStock,
      });
    } else {
      return res.json({
        inStock: false,
      });
    }

    // const filterObject = {
    //   _id: searchParams.productId,
    //   productType: body.productType,
    // };

    // const productItem = await Product.findOne(filterObject);

    // // console.log(productItem.productVariant);

    // inStock = !!productItem && productItem?.availableStocks > 0;

    // return res.json({
    //   inStock,
    // });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Internal server error!",
    });
  }
});

module.exports = router;
