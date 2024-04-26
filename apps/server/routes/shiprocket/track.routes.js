const express = require("express");
const shipRocketLogin = require("../../helpter/shipRocketLogin");
const checkRole = require("../../middlewares");

const router = express.Router();

//! ORDER TRACKING DATA -- used by normal user
router.get("/:orderId", checkRole(1, 0), async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const shiprocketChannelId = process.env.SHIPROCKET_CHANNELID;

    if (!orderId) return res.status(400).json({ message: "OrderId Missing" });

    if (!shiprocketChannelId) {
      return res.status(400).json({ message: "Shiprocket Channel ID Missing" });
    }

    const shipRocketAuthToken = await shipRocketLogin();

    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}&channel_id=${shiprocketChannelId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${shipRocketAuthToken}`,
        },
      }
    );

    const data = await response.json();

    return res
      .status(data.status_code || 200)
      .json(data.message ? { message: data.message } : data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
