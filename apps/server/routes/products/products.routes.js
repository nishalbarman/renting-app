const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const { Product, ProductVariant } = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { isValidUrl } = require("custom-validator-renting");
const Order = require("../../models/order.model");

const checkRole = require("../../middlewares");

const { ImageUploadHelper } = require("../../helpter/imgUploadhelpter");

const TAG = "products/route.js:--";

// product validation function, so we can determine an product has valid or invalid data
const checkProductHasError = ({
  previewImage,
  title,
  category,
  discountedPrice,
  originalPrice,
  slideImages,
  description,
  shippingPrice,
  availableStocks,
  isVariantAvailable,
  productVariant,
  rentingPrice,
}) => {
  const error = [];
  // if (!Array.isArray(previewImage)) {
  //   error.push("Preview Image should be a non empty array");
  // }

  if (!title || title?.length < 5) {
    error.push("Title should be of minimum 5 characters");
  }

  // const ObjectId = mongoose.Types.ObjectId;
  // if (
  //   !category ||
  //   !(ObjectId.isValid(category) && String(new ObjectId(category)) === category)
  // ) {
  //   error.push("Category is not valid");
  // }

  if (!discountedPrice && !originalPrice && !rentingPrice) {
    error.push("Original price and Discounted price needs to be given");
  }

  if (
    isNaN(Number(rentingPrice)) ||
    isNaN(Number(discountedPrice)) ||
    isNaN(Number(originalPrice))
  ) {
    error.push(
      "Original price, Discounted price and Renting price should be numbers"
    );
  }

  if (
    !!discountedPrice &&
    !!originalPrice &&
    +originalPrice <= +discountedPrice
  ) {
    error.push("Discounted price should be lesser than Original price");
  }

  // if (!Array.isArray(slideImages)) {
  //   error.push("Slide images should be an non empty array");
  // }

  try {
    const html = cheerio.load(description);
  } catch (err) {
    error.push("Description is not valid html");
  }

  if (!!shippingPrice && isNaN(parseInt(shippingPrice))) {
    error.push("Shipping price must be a valid number");
  }

  if (!!availableStocks && isNaN(parseInt(availableStocks))) {
    error.push("Stock mube be a valid non zero number");
  }

  if (!!isVariantAvailable) {
    productVariant.forEach((variant, index) => {
      if (Object.keys(variant).length !== 9) {
        return error.push("Variant does not contain all the required keys");
      }

      const localError = [];

      // if (!isValidUrl(variant?.previewImage)) {
      //   localError.push("Preview Image is not valid");
      // }

      if (!variant?.discountedPrice && !variant?.originalPrice) {
        localError.push(
          "Original price and Discounted price needs to be given"
        );
      }

      if (
        !!variant?.discountedPrice &&
        !!variant?.originalPrice &&
        variant?.originalPrice <= variant?.discountedPrice
      ) {
        localError.push(
          "Discounted price should be lesser than Original price"
        );
      }

      // if (!Array.isArray(variant?.slideImages)) {
      //   localError.push("Slide images should be an non empty array");
      // }

      if (!!variant?.shippingPrice && isNaN(parseInt(variant?.shippingPrice))) {
        localError.push("Shipping price must be a valid number");
      }

      if (
        !!variant?.availableStocks &&
        isNaN(parseInt(variant?.availableStocks))
      ) {
        localError.push("Stock mube be a valid non zero number");
      }

      if (!variant?.color) {
        localError.push(
          "Variant +" + (index + 1) + ": " + "Color is not vallid"
        );
      }

      if (!variant?.size) {
        localError.push(
          "Variant +" + (index + 1) + ": " + "Size is not vallid"
        );
      }

      if (localError.length > 0) {
        error.push(
          `Variant: ${index + 1}, has errors. Message: ${localError.join(", ")}`
        );
      }
    });
  }

  return error;
};

const checkUpdatedProductHasError = ({
  previewImage,
  title,
  category,
  discountedPrice,
  originalPrice,
  slideImages,
  description,
  shippingPrice,
  availableStocks,
  isVariantAvailable,
  productVariant,
  rentingPrice,
}) => {
  const error = [];
  // if (!Array.isArray(previewImage)) {
  //   error.push("Preview Image should be a non empty array");
  // }

  if (!title || title?.length < 5) {
    error.push("Title should be of minimum 5 characters");
  }

  // const ObjectId = mongoose.Types.ObjectId;
  // if (
  //   !category ||
  //   !(ObjectId.isValid(category) && String(new ObjectId(category)) === category)
  // ) {
  //   error.push("Category is not valid");
  // }

  if (!discountedPrice && !originalPrice && !rentingPrice) {
    error.push("Original price and Discounted price needs to be given");
  }

  if (
    isNaN(Number(rentingPrice)) ||
    isNaN(Number(discountedPrice)) ||
    isNaN(Number(originalPrice))
  ) {
    error.push(
      "Original price, Discounted price and Renting price should be numbers"
    );
  }

  if (
    !!discountedPrice &&
    !!originalPrice &&
    +originalPrice <= +discountedPrice
  ) {
    error.push("Discounted price should be lesser than Original price");
  }

  // if (!Array.isArray(slideImages)) {
  //   error.push("Slide images should be an non empty array");
  // }

  try {
    const html = cheerio.load(description);
  } catch (err) {
    error.push("Description is not valid html");
  }

  if (!!shippingPrice && isNaN(parseInt(shippingPrice))) {
    error.push("Shipping price must be a valid number");
  }

  if (!!availableStocks && isNaN(parseInt(availableStocks))) {
    error.push("Stock mube be a valid non zero number");
  }

  if (!!isVariantAvailable) {
    productVariant.forEach((variant, index) => {
      if (Object.keys(variant).length !== 14) {
        return error.push("Variant does not contain all the required keys");
      }

      const localError = [];

      // if (!isValidUrl(variant?.previewImage)) {
      //   localError.push("Preview Image is not valid");
      // }

      if (!variant?.discountedPrice && !variant?.originalPrice) {
        localError.push(
          "Original price and Discounted price needs to be given"
        );
      }

      if (
        !!variant?.discountedPrice &&
        !!variant?.originalPrice &&
        variant?.originalPrice <= variant?.discountedPrice
      ) {
        localError.push(
          "Discounted price should be lesser than Original price"
        );
      }

      // if (!Array.isArray(variant?.slideImages)) {
      //   localError.push("Slide images should be an non empty array");
      // }

      if (!!variant?.shippingPrice && isNaN(parseInt(variant?.shippingPrice))) {
        localError.push("Shipping price must be a valid number");
      }

      if (
        !!variant?.availableStocks &&
        isNaN(parseInt(variant?.availableStocks))
      ) {
        localError.push("Stock mube be a valid non zero number");
      }

      if (!variant?.color) {
        localError.push(
          "Variant +" + (index + 1) + ": " + "Color is not vallid"
        );
      }

      if (!variant?.size) {
        localError.push(
          "Variant +" + (index + 1) + ": " + "Size is not vallid"
        );
      }

      if (localError.length > 0) {
        error.push(
          `Variant: ${index + 1}, has errors. Message: ${localError.join(", ")}`
        );
      }
    });
  }

  return error;
};

router.get("/", async (req, res) => {
  try {
    const searchParams = req.query;

    let PAGE = searchParams.page || 0;
    const LIMIT = searchParams.limit || 50;
    const SKIP = PAGE * LIMIT;

    // filter result by query params
    const TYPE = searchParams?.productType;
    const CATEGORY = searchParams?.category;
    const QUERY = searchParams?.query;

    const filter = {}; // blank filter object

    if (QUERY) {
      filter["$text"] = { $search: QUERY };
    }

    if (TYPE) {
      filter.productType = { $in: [TYPE, "both"] };
    }

    if (CATEGORY) {
      filter.category = CATEGORY;
    }

    const totalProductsCount = await Product.countDocuments(
      filter,
      !!QUERY ? { score: { $meta: "textScore" } } : undefined
    );

    const products = await Product.find(filter)
      .populate(["category", "productVariant"])
      .sort(!!QUERY ? { score: { $meta: "textScore" } } : { createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    const toalPages = Math.ceil(totalProductsCount / LIMIT);

    return res.status(200).json({
      toalPages,
      data: products,
      totalProductCount: totalProductsCount,
    });
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

router.get("/admin-view/:productId", checkRole(1), async (req, res) => {
  try {
    const productId = req.params?.productId;

    // check whether we have the product id or not
    if (!productId) {
      return res
        .status(400)
        .json({ redirect: "/products", message: "Product ID missing!" });
    }

    const product = await Product.findOne({ _id: productId }).populate([
      "category",
      "productVariant",
    ]);

    if (!product) {
      return res.status(404).json({ message: "No such product found." });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// ADMIN ROUTE : Product create route
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

    const productData = req.body?.productData;

    if (!productData) {
      return res.status(400).json({ message: "Product Data Not Found" });
    }

    // // if the key products in request object is missing or it is not an array then return false
    // if (!reqBody?.products || !Array.isArray(reqBody?.products)) {
    //   return res.status(400).json({ message: "Expected an array!" });
    // }

    // validate recieved products and filter out valid products and insert them on database
    // const errorProductList = [];
    // const validProducts = reqBody.productList.filter((singleProduct, index) => {
    //   const errorObject = {};
    //   const error = isProductHasError(singleProduct); // validate the product
    //   if (error.length > 0) {
    //     errorObject.message = error.join(", ");
    //     errorObject.index = index;
    //     errorProductList.push(errorObject);
    //     return false; // false as product does not has valid data
    //   } else {
    //     return true; // true as product has valid data
    //   }
    // });

    productData.productVariant = Object.values(productData.productVariant);

    const error = checkProductHasError(productData);

    if (error.length > 0) {
      return res.status(400).json({ message: error.join(", ") });
    }

    try {
      productData.previewImage = await ImageUploadHelper.uploadBulkImages(
        productData.previewImage
      );

      if (productData.slideImages.length > 0) {
        const slideImages = await ImageUploadHelper.uploadBulkImages(
          productData.slideImages
        );
        productData.slideImages = slideImages;
      }

      const variants = productData.productVariant;

      for (let i = 0; i < variants.length; i++) {
        variants[i].previewImage = await ImageUploadHelper.uploadBulkImages(
          variants[i].previewImage
        );
        if (variants[i].slideImages.length > 0) {
          const slideImages = await ImageUploadHelper.uploadBulkImages(
            variants[i].slideImages
          );
          variants[i].slideImages = slideImages;
        }
      }

      // console.log("Variants --> is object or array -->", variants);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "File upload error" });
    }

    // Now here till this point we have uploaded all the images in firebase storage.. (previewImage, slideImages, variant.previewImage, variant.slideImages ...)

    // Now we are going to save the product to our database

    console.log(productData);

    // Create a new product document
    const newProduct = new Product({
      previewImage: productData.previewImage[0],
      title: productData.title,
      // category: productData.category,
      category: "65f6c9f882ba818ab0e43d64",
      slideImages: productData.slideImages,
      description: productData.description,
      productType: productData.productType,
      shippingPrice: +productData.shippingPrice,
      availableStocks: +productData.availableStocks,
      rentingPrice: +productData.rentingPrice,
      discountedPrice: +productData.discountedPrice,
      originalPrice: +productData.originalPrice,
      isVariantAvailable: !!productData.isVariantAvailable,
    });

    if (productData?.isVariantAvailable) {
      // variants structure ==> [{key: value},{...}, {...}]
      const variantPromises = Object.entries(productData.productVariant).map(
        async ([key, value]) => {
          const variantData = {
            product: newProduct._id,

            previewImage: value.previewImage[0],
            slideImages: value.slideImages,

            size: value.size,
            color: value.color,
            availableStocks: +value.availableStocks,
            shippingPrice: +value.shippingPrice,
            rentingPrice: +value.rentingPrice,
            discountedPrice: +value.discountedPrice,
            originalPrice: +value.originalPrice,
          };

          return ProductVariant.create(variantData);
        }
      );
      const variants = await Promise.all(variantPromises);
      newProduct.productVariant = variants.map((variant) => variant._id);
    }

    console.log(newProduct);

    await newProduct.save();

    return res.status(200).json({
      message: `Product created`,
      data: productData,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/update/:productId", checkRole(1), async (req, res) => {
  try {
    const productId = req.params?.productId;
    const productData = req.body?.productData;

    if (!productId) {
      return res.status(400).json({ message: "Product ID Not Found" });
    }

    if (!productData) {
      return res.status(400).json({ message: "Product Data Not Found" });
    }

    // TODO: Need to validate the incoming key values so that it fits the required formate

    productData.productVariant = Object.values(productData.productVariant);

    const error = checkUpdatedProductHasError(productData);

    if (error.length > 0) {
      return res.status(400).json({ message: error.join(", ") });
    }

    try {
      if (productData.previewImage.length > 0) {
        productData.previewImage = await ImageUploadHelper.uploadBulkImages(
          productData.previewImage
        );
      }

      if (productData.slideImages.length > 0) {
        const slideImages = await ImageUploadHelper.uploadBulkImages(
          productData.slideImages
        );
        productData.slideImages = slideImages;
      }

      const variants = productData?.productVariant;

      for (let i = 0; i < variants.length; i++) {
        console.log(variants[i]);

        if (variants[i].previewImage.length > 0) {
          variants[i].previewImage = await ImageUploadHelper.uploadBulkImages(
            variants[i].previewImage
          );
        }

        if (variants[i].slideImages.length > 0) {
          const slideImages = await ImageUploadHelper.uploadBulkImages(
            variants[i].slideImages
          );
          variants[i].slideImages = slideImages;
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "File upload error" });
    }

    // Now here till this point we have uploaded all the images in firebase storage.. (previewImage, slideImages, variant.previewImage, variant.slideImages ...)

    // Now we are going to update the product

    // Update product document

    const productUpdatedData = {
      title: productData.title,
      // category: productData.category,
      category: productData.category,
      description: productData.description,
      productType: productData.productType,
      shippingPrice: +productData.shippingPrice,
      availableStocks: +productData.availableStocks,
      rentingPrice: +productData.rentingPrice,
      discountedPrice: +productData.discountedPrice,
      originalPrice: +productData.originalPrice,
    };

    if (productData.previewImage.length > 0) {
      productUpdatedData.previewImage = productData.previewImage[0];
    }

    if (productData.slideImages.length > 0) {
      productUpdatedData.slideImages = productData.slideImages;
    }

    console.log(productId);

    await Product.findByIdAndUpdate(productId, productUpdatedData);

    if (productData?.isVariantAvailable) {
      // variants structure ==> [{key: value},{...}, {...}]
      const variantPromises = Object.entries(productData.productVariant).map(
        async ([key, value]) => {
          const variantData = {
            size: value.size,
            color: value.color,
            availableStocks: +value.availableStocks,
            shippingPrice: +value.shippingPrice,
            rentingPrice: +value.rentingPrice,
            discountedPrice: +value.discountedPrice,
            originalPrice: +value.originalPrice,
          };

          if (value.previewImage.length) {
            variantData.previewImage = value.previewImage[0];
          }

          if (value.slideImages.length) {
            variantData.slideImages = value.slideImages;
          }

          return ProductVariant.findByIdAndUpdate(value._id, variantData);
        }
      );
      await Promise.all(variantPromises);
    }

    return res.status(200).json({
      message: `Product Updated`,
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

// ADMIN ROUTE : Product delete route
router.post("/delete", checkRole(1), async (req, res) => {
  try {
    const deletableProductIds = req.body?.deletableProductIds;

    if (!Array.isArray(deletableProductIds)) {
      return res.status(400).json({ message: "Product ID(s) Not Found" });
    }

    const deletePromises = deletableProductIds.map(async (productId) => {
      const product = await Product.findById(productId);
      console.log(product);
      await ProductVariant.deleteMany(
        product?.productVariantmap?.map((variant) => variant._id)
      );
      await Product.findByIdAndDelete(productId);
    });

    await Promise.all(deletePromises);

    // if (!product)
    //   return res
    //     .status(400)
    //     .json({ message: "Product not found with given ID." });

    return res.json({ message: "Product(s) deleted." });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
