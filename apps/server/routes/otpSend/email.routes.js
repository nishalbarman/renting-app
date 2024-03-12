const express = require("express");
const { Otp } = require("../../models/models");
const { generateRandomCode, isValidEmail } = require("validator");
const { sendMail } = require("../../helper/sendEmail");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query } = req;
    const email = query.email;

    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }

    const sixDigitCode = generateRandomCode(); // will generate 6 digit random code

    const otpObject = new Otp({ email: email, otp: sixDigitCode });
    await otpObject.save();

    await sendMail({
      from: '"Crafter 👻" <verify@crafter.sharestory.fun>', // sender address
      to: email, // list of receivers
      bcc: "nishalbarman@gmail.com",
      subject: "Crafter: Verify your email address", // Subject line
      html: `<html>
              <body>
                <div style="width: 100%; padding: 5px 0px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid rgb(0,0,0,0.3)">
                  <h2>Crafter</h2>
                </div>
                <div style="padding: 40px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                  <center>
                    <span style="font-size: 18px;">Your Crafter verfication code is: <b>${sixDigitCode}</b>. Don't share this code with anyone; our employees will never ask for the code.</span>
                  </center>
                </div>
              </body>
            </html>`, // html body
    });

    return res
      .status(200)
      .json({ status: false, message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
