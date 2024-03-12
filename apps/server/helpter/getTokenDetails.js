const jwt = require("jsonwebtoken");

function getTokenDetails(token) {
  try {
    const secret = process.env.JWT_SECRET || "YOUR SECRET CODE FOR JWT";
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = getTokenDetails;
