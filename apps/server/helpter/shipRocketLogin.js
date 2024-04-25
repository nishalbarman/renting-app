const cache = require("memory-cache");

const shipRocketLogin = async () => {
  try {
    let shipRocketAuthToken = cache.get("shipRocketAuthToken");
    if (!shipRocketAuthToken) {
      const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/auth/login`,
        {
          method: "POST",
          body: {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
          },
        }
      );
      const data = await response.json();
      cache.put("shipRocketAuthToken", data.token, 864000000);
      return data.token;
    }

    return shipRocketAuthToken;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = shipRocketLogin;
