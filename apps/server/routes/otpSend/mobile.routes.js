const express = require("express");
const { Otp } = require("../../models/models");
const { generateRandomCode, isValidIndianMobileNumber } = require("validator");
const otpSender = require("../../helpter/otpSender");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mobileNo = req.query.mobileNo;

    if (!isValidIndianMobileNumber(mobileNo)) {
      return res.status(400).json({
        status: false,
        message: "Invalid phone number",
      });
    }

    const randomCode = generateRandomCode();
    const text = `Your Renting App verification code is: ${randomCode}. Don't share this code with anyone; our employees will never ask for the code.`;

    const otpObject = new Otp({ mobileNo: mobileNo, otp: randomCode });
    await otpObject.save();

    await otpSender({ numbers: mobileNo, message: text });
    return res.status(200).json({
      status: true,
      message: "OTP sent to your mobile number",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
    // return res.status(500).json({ status: false, message: 'OTP sent failed' });
  }
});

module.exports = router;
