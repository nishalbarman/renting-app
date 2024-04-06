const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { Product } = require("../../models/product.model");

router.get("/", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({ message: "Authorization failed" });
    }

    const searchQuery = req.query;

    const PAGE = searchQuery.page || 1;
    const LIMIT = searchQuery.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const cartDetails = await Cart.find({
      user: userDetails._id,
      productType: searchQuery.productType,
    })
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT)
      .populate([
        {
          path: "product",
          select: "-showPictures -description -stars -productVariant",
        },
        {
          path: "variant",
        },
      ])
      .select("-user");

    // Check if wishlistDetails has any items
    if (cartDetails.length === 0) {
      return res.json({
        data: [],
      }); // Return null if no wishlist details are found
    }

    // Check if product field is null or empty in the first item
    if (!cartDetails[0].product) {
      return res.json({
        data: [],
      }); // Return null if no wishlist details are found
    }

    return res.json({
      data: cartDetails,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal server error!",
    });
  }
});

/* ADD TO CART */
router.post("/", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({ message: "Authorization failed" });
    }

    const productInfo = req.body;

    // maybe these all mongo operations can be done using one aggregate pipeline
    const cartCount = await Cart.countDocuments({
      product: productInfo.productId,
      user: userDetails._id,
      productType: productInfo.productType,
    });

    if (cartCount >= 45) {
      return res.status(400).json({
        message: "Only maximum 50 Cart items allowed!",
      });
    }

    const product = await Product.findById(productInfo.productId);
    if (product?.isVariantAvailable && !productInfo?.variant) {
      return res.status(400).json({
        message:
          "Product varient available but not selected, kindly select proper size or color",
      });
    }

    const filterObject = {
      product: productInfo.productId,
      user: userDetails._id,
      productType: productInfo.productType,
    };

    if (productInfo?.variant) {
      filterObject.variant = productInfo.variant;
    }

    const cartItem = await Cart.findOneAndUpdate(filterObject, {
      $inc: {
        quantity: productInfo?.quantity || 1,
      },
    });

    if (!!cartItem) {
      return res.json({
        status: true,
        message: "Added to Cart",
      });
    }

    const cart = new Cart({
      user: userDetails._id,
      product: productInfo.productId,
      productType: productInfo.productType,
      quantity: productInfo.quantity,
      rentDays: productInfo.rentDays,
    });

    if (productInfo?.variant) {
      cart.variant = productInfo.variant;
    }

    await cart.save();

    return res.json({
      message: "Added to Cart",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal server error!",
    });
  }
});

router.patch("/:productType", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    // handle invalid token
    if (!token) {
      return res.status(400).json({
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);
    if (!userDetails) {
      return res.status(400).json({ message: "Authorization failed" });
    }

    const productType = req.params?.productType;

    // console.log(productType);

    if (!productType) {
      return res.status(400).json({ message: "Product Type is Missing" });
    }

    const cart_item_id = req.query?.cart;

    if (!cart_item_id) {
      return res.status(400).send({ message: "Cart Item Id Missing" });
    }

    const rentDays = req.body?.rentDays;
    const quantity = req.body?.quantity;
    const size = req.body?.size;
    const color = req.body?.color;

    const cartProduct = await Cart.findOne({
      _id: cart_item_id,
      user: userDetails._id,
      productType,
    });

    if (!cartProduct) {
      return res.status(400).json({
        message: "No items in cart",
      });
    }

    if (productType === "rent" && !!rentDays) {
      cartProduct.rentDays = rentDays;
    }

    if (!!quantity) {
      cartProduct.quantity = quantity;
    }

    if (!!size) {
      cartProduct.size = size;
    }

    if (!!color) {
      cartProduct.color = color;
    }

    await cartProduct.save({ validateBeforeSave: false });

    return res.json({
      message: "Cart Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:cart_item_id", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({
        message: "Token validation failed",
      });
    }

    const { cart_item_id } = req.params;

    const cartDetails = await Cart.findOneAndDelete({
      _id: cart_item_id,
      user: userDetails._id,
    });

    if (!cartDetails) {
      return res.status(400).json({
        status: false,
        message: "No items found!",
      });
    }

    return res.json({
      status: true,
      message: "Cart item deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

router.post("/incart/:productId", async (req, res) => {
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

    const filterObject = {
      product: searchParams.productId,
      productType: body.productType,
      user: userDetails._id,
    };

    if (body?.variant) {
      filterObject.variant = body.variant;
    }

    const cartItem = await Cart.findOne(filterObject);

    if (!!cartItem) {
      return res.json({
        incart: true,
      });
    }

    return res.json({
      incart: false,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal server error!",
    });
  }
});

module.exports = router;
