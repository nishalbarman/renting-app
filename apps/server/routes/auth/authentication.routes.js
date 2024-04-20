const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passValidator = require("password-validator");
const { v4: uuidv4 } = require("uuid");

const User = require("../../models/user.model");
const Otp = require("../../models/otp.model");
const Role = require("../../models/role.model");

const {
  isValidEmail,
  isValidIndianMobileNumber,
  hasOneSpaceBetweenNames,
} = require("custom-validator-renting");
const { globalErrorHandler } = require("../../helpter/globalErrorHandler");

const validatePass = new passValidator();
validatePass.is().min(8).has().uppercase().has().lowercase();

const secret = process.env.JWT_SECRET;

const router = express.Router();

router.post("/admin-login", async (req, res) => {
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
    globalErrorHandler(res, error);
  }
});

router.post("/login", async (req, res) => {
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

    if (!user) {
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

    if (!user?.isMobileNoVerified) {
      return res.status(403).json({
        message: "Account not verified yet!",
      });
    }

    const oneDay = 24 * 60 * 60 * 1000;

    const jwtToken = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role.role,
        email: user.email,
        mobileNo: user.mobileNo,
        center: user?.center,
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

router.post("/signup", async (req, res) => {
  try {
    const error = [];
    const { email, name, mobileNo, password, otp } = req.body;

    if (!isValidEmail(email)) {
      error.push("Invalid email");
    }

    if (!hasOneSpaceBetweenNames(name)) {
      error.push("Full name required");
    }

    if (!isValidIndianMobileNumber(mobileNo)) {
      error.push("Invalid phone number");
    }

    if (!validatePass.validate(password)) {
      error.push(
        "Password should be of minimum 8 digits containing uppercase and lowercase characters"
      );
    }

    if (error.length > 0) {
      return res.status(400).json({ status: false, message: error.join(", ") });
    }

    const otpFromDatabase = await Otp.findOne({ mobileNo, email, name }).sort({
      createdAt: "desc",
    });

    if (!otpFromDatabase) {
      error.push("OTP is invalid");
    }

    const dateObject = new Date(otpFromDatabase?.createdAt);
    const dueTimestamp = dateObject.getTime() + 10 * 60 * 1000;

    console.log(req.body.otp);
    // console.log("retrieved OTP from db", otpFromDatabase.otp);
    // console.log("Due time ==>", Math.round(dueTimestamp));
    // console.log("Current time ==>", Date.now());
    // console.log(Math.round(dueTimestamp) < Date.now());

    if (
      otpFromDatabase.otp != req.body.otp ||
      Math.round(dueTimestamp) < Date.now()
    ) {
      error.push("OTP is invalid");
    }

    if (error.length > 0) {
      return res.status(400).json({ status: false, message: error.join(", ") });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const verifyToken = uuidv4();

    const userObject = await User.create({
      email,
      name,
      mobileNo,
      password: hashedPass,
      mobileNoVerifyToken: verifyToken,
      role: "65f1c390dd964b2b01a2ee64", // default id for user role
    });

    const jwtToken = jwt.sign(
      {
        _id: userObject._id,
        name: userObject.name,
        role: 0, //! Default role for user is 0
        email: userObject.email,
        mobileNo: userObject.mobileNo,
        center: userObject?.center,
      },
      secret
    );

    console.log("User Created");

    return res.status(200).json({
      status: true,
      message: "Registration successful",
      user: {
        name: userObject.name,
        email: userObject.email,
        mobileNo: userObject.mobileNo,
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
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
