const mongoose = require("mongoose");

const globalErrorHandler = (error, statusCode, message) => {
  console.error(error);
  if (error !== undefined && error instanceof mongoose.Error && error?.errors) {
    const errArray = Object.values(error.errors).map(
      (properties) => properties.message
    );

    return res.status(400).json({
      message: errArray.join(", "),
    });
  }
  return res
    .status(statusCode || 500)
    .json({ message: message || "Internal server error" });
};

module.exports = { globalErrorHandler };
