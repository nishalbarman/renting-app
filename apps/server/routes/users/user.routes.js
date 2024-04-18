const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passValidator = require("password-validator");

const User = require("../../models/user.model");

const checkRole = require("../../middlewares");

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

router.get("/get-user-chart-data", checkRole(1), async (req, res) => {
  try {
    const year = parseInt(req.query?.year);
    const month = parseInt(req.query?.month);

    const pipeline = [
      // Stage 1: Match users created within the specified date range
      {
        $match: {
          createdAt: {
            $gte: new Date(year, month - 1, 1), // Start of the month
            $lt: new Date(year, month, 1), // Start of the next month
          },
        },
      },
      // Stage 2: Group by date and count users
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 }, // Count users
        },
      },
      // Stage 3: Project to format date and rename fields
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%B %d, %Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          count: 1,
        },
      },
      // Stage 4: Sort by date
      {
        $sort: { date: 1 },
      },
      // Stage 5: Group to calculate total users
      {
        $group: {
          _id: null,
          totalUsers: { $sum: "$count" },
          chartData: { $push: "$$ROOT" },
        },
      },
      // Stage 6: Project to reshape output
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          chartData: 1,
        },
      },
    ];

    // Replace "createdAt" with the appropriate timestamp field if you're using a different field
    // Execute the pipeline using the aggregate function on your User model
    const chartData = await User.aggregate(pipeline);
    return res.status(200).json(chartData[0]);
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error && error?.errors) {
      const errArray = Object.values(error.errors).map(
        (properties) => properties.message
      );

      return res.status(400).json({
        message: errArray.join(", "),
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
