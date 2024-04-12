const express = require("express");
const router = express.Router();
const Address = require("../../models/address.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    console.log("Here in address router");

    const token = req.jwt.token || null;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const address = await Address.find({
      user: userDetails._id,
    })
      .sort({ createdAt: "desc" })
      .select("-user");

    console.log("Getting request on address route", address);

    return res.json({
      data: address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req?.jwt?.token || null;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const oldAddressCount = await Address.countDocuments({
      user: userDetails._id,
    });

    if (oldAddressCount >= 5) {
      return res.status(400).json({
        status: false,
        message: "Address limit reached, you can only add upto 5 addresses",
      });
    }

    const newAddress = new Address({
      user: userDetails._id,
      ...req.body,
      location: {
        type: "Point",
        coordinates: [+req.body.longitude, +req.body.latitude],
      },
    });
    await newAddress.save();

    return res.json({
      message: "Address added.",
    });
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error) {
      /* I added custom validator functions in mongoose models, so the code is to chcek whether the errors are from mongoose or not */
      const errArray = [];
      for (let key in err.errors) {
        errArray.push(err.errors[key].properties.message);
      }

      return res
        .status(400)
        .json({ message: errArray.join(", ").replaceAll(" Path", "") });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:address_item_id", async (req, res) => {
  try {
    const token = req.jwt.token || null;

    // handle invalid token
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);
    if (!userDetails) {
      return res.status(400).json({
        status: false,
        message: "Token validation failed",
      });
    }

    const { address_item_id } = req.params;

    if (!req?.body) {
      return res.status(400).json({
        message: "expected some values to update, no values found",
      });
    }

    const updatedAddress = {};
    Object.keys(req?.body).map((key) => {
      if (!!req?.body[key]) updatedAddress[key] = req.body[key];
    });

    if (!updatedAddress) {
      return res.status(400).json({
        message: "expected some values to update, no values found",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        user: userDetails._id,
        _id: address_item_id,
      },
      {
        $set: req.body,
      }
    );

    if (!address) {
      return res.status(400).json({ message: "Address update failed" });
    }

    return res.json({
      message: "Address updated.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:address_item_id", async (req, res) => {
  try {
    const token = req?.jwt?.token;

    if (!token) {
      return res.status(400).json({
        message: "Token validation failed",
      });
    }

    const userDetails = getTokenDetails(token);

    if (!userDetails) {
      return res.status(400).json({
        message: "Token validation failed",
      });
    }

    const { address_item_id } = req.params;

    console.log("address_item_id", address_item_id);

    const addressDetails = await Address.findOneAndDelete({
      _id: address_item_id,
      user: userDetails._id,
    });

    if (!addressDetails) {
      return res.status(400).json({
        message: "No address found with provided id!",
      });
    }

    return res.json({
      status: true,
      message: "Address deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
