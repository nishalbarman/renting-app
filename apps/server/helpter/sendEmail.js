const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "crafter.sharestory.fun",
//   port: 587,
//   // secure: true,
//   tls: {
//     rejectUnauthorized: false,
//     minVersion: "TLSv1.2",
//   },
//   auth: {
//     user: "verify@crafter.sharestory.fun",
//     pass: "#%(uvL_](%3i",
//   },
// });
const transporter = nodemailer.createTransport({
  host: process.env.SENDER_EMAIL_HOST,
  port: 587,
  // secure: true,
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  auth: {
    user: process.env.SENDER_EMAIL_ADDRESS,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

module.exports = {
  sendMail: async function sendMail(messageObject) {
    await transporter.sendMail(messageObject);
  },
};
