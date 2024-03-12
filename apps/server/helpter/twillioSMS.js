const accountSid = "AC32fad38bb630a205ffca152d4e295d73";
const authToken = "2ca1109cd23d66c26bcaffee1dcc8e8f";
const client = require("twilio")(accountSid, authToken);

const twillioSendSMS = async ({ numbers, message }) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+919101114906",
    });

    console.log(response.data.sid);
  } catch (error) {
    throw error;
  }
};

module.exports = twillioSendSMS;
