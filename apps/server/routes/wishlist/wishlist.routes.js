const express = require("express");
const router = express.Router();
const Wishlist = require("../../models/wishlist.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const checkRole = require("../../middlewares");

/* GET ALL WISHLIST -- User Route */
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

    const productType = req.headers["producttype"];

    console.log("Product Type -->", productType);

    const searchQuery = req.query;

    const PAGE = searchQuery.page || 1;
    const LIMIT = searchQuery.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const wishlistDetails = await Wishlist.find({
      user: userDetails._id,
      productType,
    })
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT)
      .populate("product")
      .select("-user");

    console.log("Wishlist data -->", wishlistDetails);

    return res.json({
      data: wishlistDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
});

/* ADD TO WISHLIST -- User Route */
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

    // console.log("RequestBody-->", req.body);

    const productType = req.headers["producttype"];
    const { productId } = req.body;

    // console.log("Wishlist Product ID-->", productId);

    const wishlistCount = await Wishlist.countDocuments({
      product: productId,
      user: userDetails._id,
      productType,
    });

    if (wishlistCount >= 45) {
      return res.status(400).json({
        message: "Only maximum 50 wishlist items allowed!",
      });
    }

    const wishlistItem = await Wishlist.findOne({
      product: productId,
      user: userDetails._id,
      productType,
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
      productType,
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

router.delete("/:wishlistId", checkRole(0), async (req, res) => {
  try {
    const wishlistId = req.params?.wishlistId;

    const wishlistDetails = await Wishlist.findByIdAndDelete(wishlistId);

    if (!wishlistDetails) {
      return res.json({
        status: true,
        message: "Wishlist item deletion failed",
      });
    }

    return res.json({
      message: "Wishlist item deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
});

module.exports = router;
