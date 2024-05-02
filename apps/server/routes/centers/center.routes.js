const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Address = require("../../models/address.model");
const getTokenDetails = require("../../helpter/getTokenDetails");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const Center = require("../../models/center.model");
const checkRole = require("../../middlewares");

const { ImageUploadHelper } = require("../../helpter/imgUploadhelpter");

router.get(
  "/list",
  checkRole(1) /* required admin role */,
  async (req, res) => {
    try {
      const searchParams = req.query;

      let PAGE = searchParams.page || 0;
      const LIMIT = searchParams.limit || 50;
      const SKIP = PAGE * LIMIT;

      const centerTotalDocuments = await Center.countDocuments();
      const center = await Center.find()
        .sort({ createdAt: "desc" })
        .populate(["user", "address"])
        .skip(SKIP)
        .limit(LIMIT);

      const totalPages = Math.ceil(centerTotalDocuments / LIMIT);

      return res.json({
        centers: center,
        totalDocumentCount: centerTotalDocuments,
        totalPages: totalPages,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error!",
      });
    }
  }
);

// This is an user route no special role required | Get all the centers available nearby for the given user address id.. This will list all the centers and will calculate addresses based on user address
router.get("/addresses/:userAddressID", checkRole(0), async (req, res) => {
  try {
    // const token = req?.jwt?.token;

    // if (!token) {
    //   return res.status(400).json({
    //     message: "Token validation failed",
    //   });
    // }

    // const userDetails = getTokenDetails(token);

    // if (!userDetails) {
    //   return res.status(400).json({
    //     message: "Token validation failed",
    //   });
    // }

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
          // maxDistance: 10000, //! Max distance in meters
          query: {
            approvedStatus: "approved",
          }, // Additional query conditions can be added here if needed
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

router.post("/add", checkRole(1), async (req, res) => {
  try {
    const centerData = req.body?.centerData;

    if (!centerData) {
      return res.status(400).json({ message: "Center Data not found" });
    }

    //! User details
    const userName = centerData?.name;
    const email = centerData?.email;
    const mobileNo = centerData?.mobileNo;
    let password = centerData?.password;

    //! Center details
    const centerName = centerData?.centerName;
    const streetName = centerData?.streetName;
    const locality = centerData?.locality;
    const postalCode = centerData?.postalCode;
    const city = centerData?.city;
    const country = centerData?.country;
    const longitude = centerData?.longitude;
    const latitude = centerData?.latitude;

    //! Images to upload
    let addressProof = centerData?.addressProof;
    let identityProof = centerData?.identityProof;
    let centerImages = centerData?.centerImages;

    // TODO: Validate all those fields before saving in database

    centerImages = await ImageUploadHelper.uploadBulkImages(centerImages);
    addressProof = await ImageUploadHelper.uploadBulkImages(addressProof);
    identityProof = await ImageUploadHelper.uploadBulkImages(identityProof);

    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    let user;
    try {
      user = await User.create({
        name: userName,
        email,
        mobileNo,
        password,
        isEmailVerified: false,
        isMobileNoVerified: true, // ? As admin creating this center so making mobile no verified for that reason I am out.
        role: "65f1c3e4dd964b2b01a2ee66",
      });
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

      return res.status(400).json({ message: "User creation failed!" });
    }

    const location = { type: "Point", coordinates: [longitude, latitude] };

    let address;
    try {
      address = await Address.create({
        user: user._id,
        name: "_",
        locality,
        city,
        postalCode,
        country,
        streetName,
        longitude,
        latitude,
        location,
      });
    } catch (error) {
      console.log(error);

      User.findByIdAndDelete(user?._id);

      if (error instanceof mongoose.Error && error?.errors) {
        const errArray = Object.values(error.errors).map(
          (properties) => properties.message
        );

        return res.status(400).json({
          message: errArray.join(", "),
        });
      }

      return res.status(400).json({ message: "Address creation failed!" });
    }

    let center;
    try {
      center = await Center.create({
        user: user._id,
        address: address._id,
        centerName,
        centerImage: centerImages[0],
        addressProofImage: addressProof[0],
        idProofImage: identityProof[0],
        location,
        approvedStatus: "approved",
      });
    } catch (error) {
      User.findByIdAndDelete(user?._id);
      Address.findByIdAndDelete(address?._id);

      if (error instanceof mongoose.Error && error?.errors) {
        const errArray = Object.values(error.errors).map(
          (properties) => properties.message
        );

        return res.status(400).json({
          message: errArray.join(", "),
        });
      }

      return res.status(400).json({ message: "Center creation failed!" });
    }

    return res.send({ message: "Center created." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post(
  "/delete",
  checkRole(1) /* required admin role */,
  async (req, res) => {
    try {
      const centerIds = req.body?.centerIds;
      if (!centerIds || !Array.isArray(centerIds)) {
        return res.status(400).send({ message: "Center ID missing!" });
      }

      await Center.deleteMany({ _id: { $in: centerIds } });

      return res.json({ message: "Deleted Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error!",
      });
    }
  }
);

router.patch(
  "/update/status",
  checkRole(1) /* required admin role */,
  async (req, res) => {
    try {
      const centerIds = req.body?.centerIds;
      const approvedStatus = req.body?.approvedStatus;

      if (!centerIds || !Array.isArray(centerIds)) {
        return res.status(400).send({ message: "Center ID missing!" });
      }

      if (!approvedStatus) {
        return res.status(400).send({ message: "Status missing!" });
      }

      const center = await Center.updateMany(
        { _id: { $in: centerIds } },
        {
          $set: {
            approvedStatus,
          },
        }
      );

      return res.json({ message: "Approved Successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error!",
      });
    }
  }
);

router.get("/:centerId", async (req, res) => {
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

router.patch("/:centerId", async (req, res) => {
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

module.exports = router;
