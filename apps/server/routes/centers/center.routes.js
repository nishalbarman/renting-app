const express = require("express");
const router = express.Router();
const Address = require("../../models/address.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const Center = require("../../models/center.model");

router.get("/addresses", async (req, res) => {
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

// user route
router.get("/addresses/:userAddressID", async (req, res) => {
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

    const userAddressID = req.params?.userAddressID;

    if (!userAddressID) {
      return res.status(400).json({ message: "User id is not given!" });
    }

    const userAddress = await Address.findById(userAddressID);

    // Aggregation pipeline to calculate distances and find the closest center

    const centerAddresses = await Center.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: userAddress.location.coordinates,
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 10000, // Max distance in meters
          query: {}, // Additional query conditions can be added here if needed
          key: "location", // Specify the field containing the coordinates
        },
      },
      {
        $lookup: {
          from: "addresses", // Assuming 'users' is the collection name for the referenced model
          localField: "address",
          foreignField: "_id",
          as: "populatedAddress",
        },
      },
      {
        $addFields: {
          address: { $arrayElemAt: ["$populatedAddress", 0] },
        },
      },
      {
        $lookup: {
          from: "users", // Assuming 'users' is the collection name for the referenced model
          localField: "user",
          foreignField: "_id",
          as: "populatedUser",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$populatedUser", 0] },
        },
      },
      {
        $project: {
          populatedAddress: 0, // Remove the temporary populatedAddress field
          populatedUser: 0, // Remove the temporary populatedUser field
          location: 0,
        },
      },
      { $sort: { distance: 1 } }, // Sort by distance in ascending order
      { $limit: 50 }, // Limit to the closest center
    ]);

    console.log(centerAddresses);

    if (!centerAddresses) {
      return res.status(400).json({ message: "No Center Found!" });
    }

    return res.json({
      availableCenters: centerAddresses,
      closestCenter: centerAddresses[0],
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
    });
    await newAddress.save();

    // await Promise.all([
    //   User.findOneAndUpdate(
    //     { _id: userDetails._id },
    //     {
    //       $push: { address: newAddress._id },
    //     }
    //   ),
    // ]);

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

router.get("/createCenter", async (req, res) => {
  const user = "662d3ef1564942fcddc4c5cf";
  const centerDetails = {
    user: user,
    centerName: "Test Center 1",
    centerImage: "center_demo_image",
    addressProofImage: "center_demo_image",
    idProofImage: "center_demo_image",
    address: "662d2da2a6d8c071c9337208",
  };

  const center = new Center(centerDetails);
  await center.save();
  return res.send("created");
});

module.exports = router;
