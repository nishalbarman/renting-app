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
        quantity: productInfo.quantity || 1,
      },
    });

    if (!!cartItem) {
      return res.json({
        status: true,
        message: "Item added to Cart",
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
      // cart.isVariantAvailable = true;
      cart.variant = productInfo.variant;
    }

    // if (productInfo?.size) {
    //   cart.size = productInfo.size;
    // }

    // if (productInfo?.color) {
    //   cart.color = productInfo.color;
    // }

    await cart.save();

    return res.json({
      status: true,
      message: "Item added to Cart",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal server error!",
    });
  }
});

router.patch("/:cart_item_id", async (req, res) => {
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

    const { cart_item_id } = req.params;
    const { quantity, size, color } = req.body;

    const cartProduct = await Cart.findOne({
      product: cart_item_id,
      user: userDetails._id,
    }).populate({
      path: "product",
      populate: { path: "availableSizes" },
    });

    if (!cartProduct) {
      return res.status(400).json({
        status: false,
        message: "No cart item",
      });
    }

    const responseText = [];

    if (quantity && cartProduct.product.availableStocks > quantity) {
      cartProduct.quantity = quantity;
      responseText.push("Quantity Updated");
    }

    if (
      size &&
      !!cartProduct.product.availableSizes.find(
        (value) => value._id.toString() == size
      )
    ) {
      cartProduct.size = size;
      responseText.push("Size Updated");
    }

    if (
      color &&
      !!cartProduct.product.availableColors.find(
        (value) => value._id.toString() == color
      )
    ) {
      cartProduct.color = color;
      responseText.push("Color Updated");
    }

    await cartProduct.save();

    return res.json({
      status: true,
      message: responseText.join(", "),
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/auth/login");
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

    console.log("cart in cart body -->", body);

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
