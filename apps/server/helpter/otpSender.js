const axios = require("axios");

module.exports = async ({ numbers, message }) => {
  try {
    const sender = "RENT-TXTLCL";
    const apiKey = "Nzg2YzQ2NTM1MDM5Njk3NzY0MzU3MjQ3NGY2MTM5MzQ";

    // const postData = JSON.stringify();

    const response = await axios.post(`https://dkrner.api.infobip.com`, {
      headers: {
        Authorization:
          "App 559d4abe3e98a77ce93d6f984bb15807-b7887f83-1d8f-4cf2-a124-97f07e950fe8",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: {
        messages: [
          {
            destinations: [{ to: `91${numbers}` }],
            from: "ServiceSMS",
            text: message,
          },
        ],
      },
    });

    console.log(response.data.messages);

    if (response.data.status === "success") {
      console.log("OTP Message sent!");
    } else {
      throw new Error("OTP send failed!");
    }
  } catch (error) {
    throw error;
  }
};
