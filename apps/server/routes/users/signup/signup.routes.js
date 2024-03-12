const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passValidator = require("password-validator");
const { v4: uuidv4 } = require("uuid");

const { Otp, User } = require("../../../models/models");

const validatePass = new passValidator();
validatePass.is().min(8).has().uppercase().has().lowercase();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const error = [];
    const { email, name, mobileNo, password, confirmPassword } = req.body;

    if (!isValidEmail(email)) {
      error.push("Invalid email");
    }

    if (!validatePass.validate(password)) {
      error.push(
        "Password should be of minimum 8 digits containing uppercase and lowercase characters"
      );
    }

    if (password !== confirmPassword) {
      error.push("Password and Confirm password do not match!");
    }

    const otpFromDatabase = await Otp.findOne({ mobileNo, email, name }).sort({
      createdAt: "desc",
    });

    if (!otpFromDatabase) {
      error.push("OTP is invalid");
    }

    if (
      otpFromDatabase.otp != req.body.otp ||
      otpFromDatabase.dueTime > Date.now()
    ) {
      error.push("OTP is invalid");
    }

    if (error.length > 0) {
      return res.status(200).json({ status: false, message: error.join(", ") });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const verifyToken = uuidv4();

    const userObject = new User({
      email,
      name,
      mobileNo,
      password: hashedPass,
      mobileNoVerifyToken: verifyToken,
      role: "65c9b4c9a52cbc05d8c7c543", // default id for user role
    });

    await userObject.save();

    return res.status(200).json({
      status: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error) {
      const errArray = [];
      for (let key in error.errors) {
        errArray.push(error.errors[key].properties.message);
      }

      return res.status(400).json({
        status: false,
        message: errArray.join(", ").replaceAll(" Path", ""),
      });
    }
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
