const jwt = require("jsonwebtoken");

function getTokenDetails(token) {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error("JWT Decode Error -->", err);
    return null;
  }
}

module.exports = getTokenDetails;
