const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart.model");
const getTokenDetails = require("../../helpter/getTokenDetails");

router.get("/", async (req, res) => {
  try {
    const userToken = req.cookies.token || null;
    const token = userToken?.value;

    if (!token) {
      return res.redirect("/login?redirect=cart");
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.redirect("/login?redirect=cart");
    }

    const productFilterType = {};
    if (!searchParams.productType) {
      productFilterType.isRentable = true;
    } else if (searchParams.productType === "buy") {
      productFilterType.isPurchasable = true;
    } else {
      productFilterType.isRentable = true;
    }
    const cartDetails = await Cart.find({
      user: userDetails._id,
    })
      .populate([
        {
          path: "product",
          match: productFilterType,
          populate: { path: "availableSizes" },
        },
        "size",
        "color",
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
      status: true,
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
    const userToken = req.cookies.token || null;
    const token = userToken?.value;

    if (!token) {
      return res.redirect("/login?redirect=cart");
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.redirect("/login?redirect=cart");
    }

    const { productId, size, color } = req.body;

    const cartItem = await Cart.findOneAndUpdate(
      {
        product: productId,
        user: userDetails._id,
      },
      {
        $inc: {
          quantity: 1,
        },
      }
    );

    console.log(cartItem);

    if (!!cartItem) {
      return res.json({
        status: true,
        message: "Item added to Cart",
      });
    }

    const cart = new Cart({
      user: userDetails._id,
      product: productId,
    });

    if (size) {
      cart.size = size;
    }

    if (color) {
      cart.color = color;
    }

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
    const token = req.jwt.token || null;

    // handle invalid token
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(userToken.value);
    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
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
    const userToken = req.cookies.token || null;
    const token = userToken.value || null;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(userToken.value);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const { cart_item_id } = req.params;

    const cartDetails = await Cart.findOneAndDelete({
      product: cart_item_id,
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

module.exports = router;
