const express = require("express");
const router = express.Router();
const Category = require("../../models/category.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const { ImageUploadHelper } = require("../../helpter/imgUploadhelpter");
const checkRole = require("../../middlewares");

const TAG = "categories.routes.js:--";

router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query;

    const PAGE = searchQuery?.page || 0;
    const LIMIT = searchQuery?.limit || 0;
    const SKIP = PAGE * LIMIT;

    const totalCounts = await Category.countDocuments({});

    let categories;

    if (LIMIT === 0 || page === 0) {
      categories = await Category.find({}).sort({ createdAt: "desc" });
    } else {
      categories = await Category.find({})
        .sort({ createdAt: "desc" })
        .skip(SKIP)
        .limit(LIMIT);
    }

    const totalPages = Math.ceil(totalCounts / LIMIT);

    return res.status(200).json({ totalPages, categories });
  } catch (error) {
    console.log(TAG, error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: false });
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

    const categoryData = req.body?.categoryData;

    console.log(req.body);

    if (!categoryData) {
      return res.status(400).json({ message: "Category Data Not Found" });
    }

    try {
      categoryData.categoryImageUrl = await ImageUploadHelper.uploadBulkImages(
        categoryData.categoryImageUrl
      );
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "File upload error" });
    }

    // Now here till this point we have uploaded image in firebase storage..

    // Now we are going to save the product to our database

    console.log(categoryData);

    // Create a new product document
    const newCategory = await Category.create({
      categoryImageUrl: categoryData.categoryImageUrl[0],
      categoryName: categoryData.categoryName,
      categoryKey: categoryData.categoryName
        .trim()
        .replaceAll(" ", "-")
        .toLowerCase(),
    });

    return res.status(200).json({
      message: `Category created`,
      data: newCategory,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// ADMIN ROUTE : Product create route
router.patch("/update/:categoryId", checkRole(1), async (req, res) => {
  try {
    const categoryId = req.params?.categoryId;

    const categoryData = req.body?.categoryData;

    if (!categoryData) {
      return res.status(400).json({ message: "Category Data Not Found" });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category Id Not Found" });
    }

    // const category = await Category.findById(categoryId);

    if (
      !!categoryData?.categoryImageUrl &&
      categoryData?.categoryImageUrl.length === 1
    ) {
      try {
        const url = await ImageUploadHelper.uploadBulkImages(
          categoryData.categoryImageUrl
        );
        console.log(url);
        categoryData.categoryImageUrl = url[0];
      } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "File upload error" });
      }
    } else {
      delete categoryData.categoryImageUrl;
    }

    if (categoryData?.categoryName) {
      categoryData.categoryKey = categoryData.categoryName
        .trim()
        .replaceAll(" ", "-")
        .toLowerCase();
    } else {
      delete categoryData.categoryName;
    }

    await Category.updateOne({ _id: categoryId }, { $set: categoryData });

    return res.status(200).json({
      message: `Category updated`,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// ADMIN ROUTE : Product create route
router.delete("/:categoryId", checkRole(1), async (req, res) => {
  try {
    // const token = req?.jwt?.token || null;
    // if (!token) {
    //   return res.redirect("/#login/login");
    // }

    // const userDetails = getTokenDetails(token);
    // if (!userDetails || !userDetails?.role || userDetails.role !== 1) {
    //   return res.redirect("/#login/login");
    // }

    const categoryId = req.params?.categoryId;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID Found" });
    }

    const categoryDelete = await Category.deleteOne({
      _id: categoryId,
    });

    return res.status(200).json({
      message: `Category Deleted`,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/view/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params?.categoryId;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID Found" });
    }

    const category = await Category.findOne({
      _id: categoryId,
    });

    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
