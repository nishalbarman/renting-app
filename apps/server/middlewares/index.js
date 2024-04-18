const getTokenDetails = require("../helpter/getTokenDetails");

const checkRole = (...allowedRoles) => {
  // 0 = user, 1 = admin, 2 = center

  return (req, res, next) => {
    try {
      const token = req?.jwt?.token;
      if (!token) {
        return res.redirect("/#login/login");
      }

      const userDetails = getTokenDetails(token);
      if (!userDetails ?? userDetails.role === undefined) {
        return res.redirect("/#login/login");
      }

      console.log(
        "User Details from checkRole middleware function ->",
        userDetails.role
      );

      // const allowedRoles = role.split("|");
      if (allowedRoles.includes(userDetails.role)) {
        req.jwt.role = userDetails?.role;
        req.jwt.center = userDetails?.center;
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
