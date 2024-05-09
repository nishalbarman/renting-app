const express = require("express");
const router = express.Router();
const checkRole = require("../../middlewares");
const { FirebaseUtils } = require("firebase-utils");

// Store firebase messaging token to firestore

router.post("/save-messaging-token", checkRole(0), async (req, res) => {
  try {
    const firebaseMessagingToken = req.body?.firebaseMessagingToken;
    const userId = req.user?._id;

    await FirebaseUtils.saveFirebaseTokenToDatabase({
      userId,
      firebaseMessagingToken,
    });

    return res.status(200).json({ message: "Token Saved" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error?.message });
  }
});

module.exports = router;
