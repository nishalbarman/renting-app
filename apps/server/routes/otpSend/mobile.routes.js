const express = require("express");
const { Otp } = require("../../models/models");
const {
  generateRandomCode,
  isValidIndianMobileNumber,
  hasOneSpaceBetweenNames,
  isValidEmail,
} = require("validator");
const fast2SMS = require("../../helpter/fast2SMS");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const error = [];
    const { email, name, mobileNo } = req.body;

    console.log({ email, name, mobileNo });

    if (!hasOneSpaceBetweenNames(name)) {
      error.push("Full name required");
    }

    if (!isValidEmail(email)) {
      error.push("Invalid email");
    }

    if (!isValidIndianMobileNumber(mobileNo)) {
      error.push("Invalid phone number");
    }

    if (error.length > 0) {
      return res.status(200).json({ status: false, message: error.join(", ") });
    }

    const randomCode = generateRandomCode();

    console.log(randomCode);

    const text = `Your Renting App verification code is: ${randomCode}. Don't share this code with anyone; our employees will never ask for the code.`;

    const otpObject = new Otp({
      email: email,
      name: name,
      mobileNo: mobileNo,
      otp: randomCode,
    });
    await otpObject.save();

    // await fast2SMS({ numbers: mobileNo, message: randomCode });

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
