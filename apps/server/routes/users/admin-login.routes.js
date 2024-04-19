const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const { isValidEmail } = require("custom-validator-renting");

const router = express.Router();
const secret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  // route to track user
  res.json({ status: true, message: "It's Working!" });
});

router.post("/", async (req, res) => {
  try {
    const error = [];
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      error.push("Invalid email address");
    }

    if (error.length > 0) {
      return res.status(400).json({ message: error.join(", ") });
    }

    const user = await User.findOne({ email }).populate("role");

    if (!user || user.role?.name !== "admin") {
      return res.status(400).json({
        message: "The provided credentials are invalid.",
      });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({
        message: "The provided credentials are invalid.",
      });
    }

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
