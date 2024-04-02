const express = require("express");
const multer = require("multer");
const { uploadImage } = require("firebase-utils");
const { isValidImage } = require("custom-validator-renting");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File blob is required." });
    }

    if (!isValidImage(file)) {
      return res.status(400).json({
        message:
          "Image is not valid. Acceptable files: image/png, image/jpg, image/jpeg, image/webp, and image/gif",
      });
    }

    const buffer = Buffer.from(file.buffer);
    let publicUrl;

    try {
      publicUrl = await uploadImage(buffer, file);
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: err.message });
    }

    return res.status(200).json({
      status: true,
      message: "Image uploaded",
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
