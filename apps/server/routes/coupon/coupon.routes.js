const express = require("express");
const router = express.Router();
const { Coupon } = require("../../models/models");

router.get("/", async (req, res) => {
  try {
    const code = req.query.code || null;

    const token = req.jwt.token || null;

    if (!token) {
      return res.statusCode(401).json({ message: "Unauthorized!" });
    }

    if (!code) {
      return res.json({
        status: false,
        message: "Coupon invalid",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.json({
        status: false,
        message: "Coupon invalid",
      });
    }

    return res.json({
      status: true,
      message: "Coupon applied",
      coupon: coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
