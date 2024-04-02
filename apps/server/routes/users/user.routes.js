const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passValidator = require("password-validator");

const User = require("../../models/user.model");

const {
  isValidEmail,
  hasOneSpaceBetweenNames,
} = require("custom-validator-renting");
const getTokenDetails = require("../../helpter/getTokenDetails");

const validatePass = new passValidator();
validatePass.is().min(8).has().uppercase().has().lowercase();

const secret = process.env.JWT_SECRET;

const router = express.Router();

router.patch("/update", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({ message: "Authorization failed" });
    }

    const error = [];

    const email = req.body?.email;
    const name = req.body?.name;
    const password = req.body?.password;

    const updateObject = {};
    if (email) {
      if (!isValidEmail(email)) {
        error.push("Invalid email");
      }
      updateObject.email = email;
    }

    if (name) {
      if (!hasOneSpaceBetweenNames(name)) {
        error.push("Full name required");
      }
      updateObject.name = name;
    }

    if (password) {
      if (!validatePass.validate(password)) {
        error.push(
          "Password should be of minimum 8 digits containing uppercase and lowercase characters"
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(password, salt);
      updateObject.password = hashedPass;
    }

    if (error.length > 0) {
      return res.status(400).json({ message: error.join(", ") });
    }

    const update = await User.findOneAndUpdate(
      { _id: userDetails._id },
      {
        $set: updateObject,
      }
    );

    const jwtToken = jwt.sign(
      {
        _id: update._id,
        name: update.name,
        role: update.role.role,
        email: update.email,
        mobileNo: update.mobileNo,
      },
      secret
    );

    return res.status(200).json({
      message: "User Updated",
      user: {
        name: update.name,
        email: update.email,
        mobileNo: update.mobileNo,
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
