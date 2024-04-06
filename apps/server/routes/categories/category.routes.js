const express = require("express");
const router = express.Router();
const Category = require("../../models/category.model");

const TAG = "categories.routes.js:--";

router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query;

    const PAGE = searchQuery?.page || 1;
    const LIMIT = searchQuery?.limit || 5;
    const SKIP = (PAGE - 1) * LIMIT;

    const totalCounts = await Category.countDocuments({});

    const categories = await Category.find({})
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    const totalPages = Math.ceil(totalCounts / LIMIT);

    return res.status(200).json({ totalPages, data: categories });
  } catch (error) {
    console.log(TAG, error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: false });
  }
});

module.exports = router;
