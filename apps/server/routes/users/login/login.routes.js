const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { User } = require("../../../models/models");
const { isValidEmail } = require("validator");

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
      return res.status(400).json({ status: false, message: error.join(", ") });
    }

    const user = await User.findOne({ email }).populate("role");
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

    if (!user?.isMobileNoVerified) {
      return res.status(403).json({
        status: true,
        message: "Account not verified yet!",
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
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      jwt: jwtToken,
    });

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie("token", jwtToken, { expires: new Date(Date.now() + oneDay) });
    res.cookie("name", user.name, { expires: new Date(Date.now() + oneDay) });
    res.cookie("email", user.email, { expires: new Date(Date.now() + oneDay) });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error) {
      const errArray = [];
      for (let key in error.errors) {
        errArray.push(error.errors[key].properties.message);
      }
      return res.status(400).json({
        status: false,
        message: errArray.join(", ").replace(/ Path/g, ""),
      });
    }
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

module.exports = router;
