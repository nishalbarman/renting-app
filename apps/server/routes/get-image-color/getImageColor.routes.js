const express = require("express");
const router = express.Router();
const getImageColors = require("get-image-colors");

router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const imageColors = await getImageColors(imageUrl, { count: 5 });

    const [first, second, third, ...rest] = imageColors[0]._rgb;

    const averageColor = `${first},${second},${third}`;

    return res.status(200).json({ averageColor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true });
  }
});

module.exports = router;
