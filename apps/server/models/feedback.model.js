const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    description: { type: String, required: true },
    starsGiven: { type: Number, default: 1 },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    givenBy: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    query: {
      all() {
        return this.where({});
      },
    },
  }
);

const Feedback =
  mongoose.models.feedbacks || mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
