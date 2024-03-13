const express = require("express");
const router = express.Router();
const Wishlist = require("../../models/wishlist.model");
const getTokenDetails = require("../../helpter/getTokenDetails");

router.get("/", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const userDetails = getTokenDetails(token);

    console.log(userDetails);

    if (!userDetails) {
      return res.status(400).json({ message: "No token provided." });
    }

    const wishlistDetails = await Wishlist.find({
      user: userDetails._id,
    })
      .populate("product")
      .select("-user");

    return res.json({
      status: true,
      data: wishlistDetails,
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
      return res.status(400).json({ message: "No token provided." });
    }

    console.log("RequestBody-->", req.body);

    const { productId } = req.body;

    console.log("Wishlist Product ID-->", productId);

    const wishlistItem = await Wishlist.findOne({
      product: productId,
      user: userDetails._id,
    });

    if (wishlistItem) {
      return res.status(409).json({
        status: true,
        message: "Already in wishlist",
      });
    }

    const wishlist = new Wishlist({
      user: userDetails._id,
      product: productId,
    });

    await wishlist.save();

    return res.json({
      status: true,
      message: "Item added to wishlist",
    });
  } catch (error) {
    console.log(error);
    return res.json(
      {
        status: false,
        message: "Internal server error!",
      },
      { status: 500 }
    );
  }
});

router.delete("/:product_id", async (req, res) => {
  try {
    const userToken = req.jwt.token || null;

    // handle invalid token
    if (!userToken)
      return res.json({ status: false, message: "Invalid token" });

    const { product_id } = req.params;
    const userDetails = getTokenDetails(userToken);

    const wishlistDetails = await Wishlist.findOneAndDelete({
      product: product_id,
      user: userDetails._id,
    });

    if (!wishlistDetails) {
      return res.json({
        status: true,
        message: "Wishlist item deletion failed",
      });
    }

    return res.json({
      status: true,
      message: "Wishlist item deleted",
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
