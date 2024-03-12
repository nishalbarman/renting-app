module.exports = async ({ numbers, message }) => {
  try {
    const sender = "TXTLCL";
    const apiKey = process.env.SMS_SENDER_API;

    const response = await axios.get(
      `https://api.textlocal.in/send/?apikey= ${apiKey}&numbers=${numbers}&message=${message} &sender=${sender}`
    );

    if (response.data.status === "success") {
      console.log("OTP Message sent!");
    } else {
      throw new Error("OTP send failed!");
    }
  } catch (error) {
    throw error;
  }
};
