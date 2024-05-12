const express = require("express");
const router = express.Router();
const Color = require("../../models/color.model");

router.get("/", checkRole(0, 1), async (req, res) => {
  try {
    const colors = await Color.find();

    return res.json({
      ...colors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
