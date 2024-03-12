const { Vonage } = require("@vonage/server-sdk");

// const vonage = new Vonage({
//   apiKey: "e80b621a",
//   apiSecret: "cbIKnQclOUMG8nlC",
// });

const vonage = new Vonage({
  apiKey: "4025a7f7",
  apiSecret: "45ddgsfg3gA",
});

async function sendSMS({ numbers, message }) {
  const messageObject = {
    from: "54453",
    to: numbers,
    text: message,
  };

  const response = await vonage.sms.send(messageObject);
  console.log("Message sent successfully");
  console.log(response);
  return response;
}

module.exports = sendSMS;
