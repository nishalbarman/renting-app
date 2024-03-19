const express = require("express");
const router = express.Router();
const Order = require("../../models/order.model");
const getTokenDetails = require("../../helpter/getTokenDetails");

// GET endpoint
router.get("/", async (req, res) => {
  try {
    const token = req.jwt.token || null;

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

    const orderDetails = await Order.find({
      user: userDetails._id,
    })
      .sort({ createdAt: "desc" })
      .populate("user");

      

    return res.json({
      status: true,
      data: orderDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

// PATCH endpoint
router.patch("/", async (req, res) => {
  try {
    const token = req.jwt.token || null;

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

    const { productId, size, color } = req.body;

    // Assuming Cart model is imported and defined
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
    return res.status(500).json({
      status: false,
      message: "Internal server error!",
    });
  }
});

module.exports = router;
