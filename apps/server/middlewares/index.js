const getTokenDetails = require("../helpter/getTokenDetails");

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req?.jwt?.token;
      if (!token) {
        return res.redirect("/#login/login");
      }

      const userDetails = getTokenDetails(token);
      if (!userDetails || userDetails.role === undefined) {
        return res.redirect("/#login/login");
      }

      // const allowedRoles = role.split("|");
      if (allowedRoles.includes(userDetails.role)) {
        return next();
      }

      return res
        .status(401)
        .json({ message: "Authentication error: Required role not found." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };
};

module.exports = checkRole;
