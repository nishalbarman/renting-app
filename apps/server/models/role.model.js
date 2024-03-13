const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.models.roles || mongoose.model("roles", roleSchema);

module.exports = Role;
