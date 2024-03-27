const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const Feedback = require("../../models/feedback.model");
const Order = require("../../models/order.model");

const TAG = "feedbacks.routes.js:--";

// get all feedbacks, helpfull to track by admin.. this route lists all available feedbacks for all products
router.get("/", async (req, res) => {
  try {
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const userDetails = getTokenDetails(token);

    console.log(TAG, userDetails);

    if (!userDetails || userDetails.role !== 1) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const searchParams = req.query;
    let dbSearchQuery = {};
    if (searchParams?.productId) {
      dbSearchQuery = { product: searchParams.productId };
    }

    const PAGE = searchParams.page || 1;
    const LIMIT = searchParams.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const feedbacks = await Feedback.find(dbSearchQuery)
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    console.log(feedbacks);

    return res.status(200).json({ data: feedbacks || [] });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// get the feedbacks for one individual product
router.get("/view/:productId", async (req, res) => {
  try {
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const userDetails = getTokenDetails(token);

    console.log(TAG, userDetails);

    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const { productId } = req.params;
    const searchParams = req.query;

    const PAGE = searchParams.page || 1;
    const LIMIT = searchParams.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const feedbackCount = await Feedback.countDocuments();
    const totalPages = Math.ceil(feedbackCount / LIMIT);
    const feedbacks = await Feedback.find({ product: productId })
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    console.log(feedbacks);

    return res.status(200).json({ feedbacks, totalPages });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// return one feedback result for the given feedback id
router.get("/:feedbackId", async (req, res) => {
  try {
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const userDetails = getTokenDetails(token);

    console.log(TAG, userDetails);

    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const params = req.params;
    console.log(TAG, params);

    // check whether we have the product id or not
    if (!params.feedbackId) {
      return res.status(400).json({ message: "Feedback ID missing!" });
    }

    const feedback = await Feedback.findOne({ _id: params.feedbackId });
    console.log(TAG, feedback);
    if (!feedback) {
      return res.status(404).json({ message: "No such feedback found." });
    }

    return res.status(200).json({ feedback });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

// product create route, admin can create products
router.post("/", async (req, res) => {
  try {
    console.log("am getting the request");
    const token = req?.jwt?.token;
    if (!token) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Not authorized" });
    }

    const userDetails = getTokenDetails(token);
    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Not authorized" });
    }

    const reqBody = req.body;

    const error = [];

    if (!reqBody.product) {
      error.push("product id is missing");
    }

    if (!reqBody.description) {
      error.push("review description is missing");
    }

    if (
      !reqBody.givenStars ||
      !reqBody.givenStars > 5 ||
      !reqBody.givenStars <= 0
    ) {
      error.push("review start is not properly set");
    }

    // check if user really purchased the product
    // const userOrder = await Order.findOne({ product: reqBody.product });
    // if (!userOrder) {
    //   return res.status(400).json({ message: "Not allowed!" });
    // }

    // check if this user have already gave review or not
    const alreadyGivenFeedback = await Feedback.countDocuments({
      user: userDetails._id,
      product: reqBody.product,
    });

    console.log(alreadyGivenFeedback);

    if (alreadyGivenFeedback !== 0) {
      return res.status(200).json({
        message: `Feedback was already given by user`,
      });
    }

    // insert into database
    const feedback = new Feedback({
      ...reqBody,
      givenBy: userDetails.name,
      user: userDetails._id,
    });
    await feedback.save();

    const product = await Product.findById(reqBody.product);
    console.log(product);
    // Step 1: Calculate the current total score
    const totalRatings = product.stars * product.totalFeedbacks;

    // Step 2: Add the new rating
    const newTotalRatings = totalRatings + reqBody.starsGiven;

    // Step 3: Increment the total number of reviews
    const newTotalFeedbacks = product.totalFeedbacks + 1;

    // Step 4: Calculate the new average rating
    const newAverage = (newTotalRatings / newTotalFeedbacks).toFixed(2);

    product.stars = newAverage;
    product.totalFeedbacks = newTotalFeedbacks;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: `Feedback added`,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
