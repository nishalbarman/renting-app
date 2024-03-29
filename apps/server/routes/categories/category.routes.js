const express = require("express");
const router = express.Router();
const Category = require("../../models/category.model");

const TAG = "products/route.js:--";

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({ data: categories });
  } catch (error) {
    console.log(TAG, error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: false });
  }
});

module.exports = router;
