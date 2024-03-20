const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../../models/product.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const Feedback = require("../../models/feedback.model");
const Order = require("../../models/order.model");

const TAG = "feedbacks.routes.js:--";

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

    if (!userDetails) {
      return res
        .status(401)
        .json({ redirect: "/auth/login", message: "Authorization failed!" });
    }

    const { productId } = req.body;
    const searchParams = req.query;

    const PAGE = searchParams.page || 1;
    const LIMIT = searchParams.limit || 20;
    const SKIP = (PAGE - 1) * LIMIT;

    const feedbacks = await Feedback.find({ product: productId })
      .sort({ createdAt: "desc" })
      .skip(SKIP)
      .limit(LIMIT);

    console.log(feedbacks);

    return res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

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

    // const userOrder = await Order.findOne({ product: reqBody.product });
    // if (!userOrder) {
    //   return res.status(400).json({ message: "Not allowed!" });
    // }

    // insert into database
    const feedback = new Feedback({ ...reqBody, givenBy: userDetails.name });
    await feedback.save();
    return res.status(200).json({
      message: `Feedback added`,
    });
  } catch (error) {
    console.error(TAG, error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
