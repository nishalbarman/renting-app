const express = require("express");
const router = express.Router();
const Size = require("../../models/size.model");

router.get("/", checkRole(0, 1), async (req, res) => {
  try {
    const sizes = await Size.find();

    return res.json({
      ...sizes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
