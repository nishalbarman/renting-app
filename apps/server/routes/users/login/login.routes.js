const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../../../models/user.model");
const Role = require("../../../models/role.model");
const { isValidIndianMobileNumber } = require("validator");

const router = express.Router();
const secret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  // route to track user
  res.json({ status: true, message: "It's Working!" });
});

router.post("/", async (req, res) => {
  try {
    const error = [];
    const { mobileNo, password } = req.body;

    console.log(req.body);

    if (!isValidIndianMobileNumber(mobileNo)) {
      error.push("Invalid email address");
    }

    if (error.length > 0) {
      return res.status(400).json({ status: false, message: error.join(", ") });
    }

    const user = await User.findOne({ mobileNo }).populate("role");

    console.log(user);

    if (!user) {
      return res.status(400).json({
        status: true,
        message: "The provided credentials are invalid.",
      });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({
        status: true,
        message: "The provided credentials are invalid.",
      });
    }

    // if (!user?.isMobileNoVerified) {
    //   return res.status(403).json({
    //     status: true,
    //     message: "Account not verified yet!",
    //   });
    // }

    const oneDay = 24 * 60 * 60 * 1000;

    const jwtToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role.role,
        email: user.email,
        mobileNo: user.mobileNo,
      },
      secret
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        jwtToken: jwtToken,
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error && error?.errors) {
      const errArray = Object.values(error.errors).map(
        (properties) => properties.message
      );

      return res.status(400).json({
        status: false,
        message: errArray.join(", "),
      });
    }
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

module.exports = router;
