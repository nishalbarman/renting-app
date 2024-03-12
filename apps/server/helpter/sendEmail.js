import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "crafter.sharestory.fun",
  port: 587,
  // secure: true,
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  auth: {
    user: "verify@crafter.sharestory.fun",
    pass: "#%(uvL_](%3i",
  },
});

export async function sendMail(messageObject) {
  await transporter.sendMail(messageObject);
}
