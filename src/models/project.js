const mongoose = require("mongoose");
const crypto = require("crypto");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    apiKey: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

// Auto-generate API key before saving
projectSchema.pre("save", function () {
  if (!this.apiKey) {
    this.apiKey = require("crypto")
      .randomBytes(24)
      .toString("hex");
  }
});
module.exports = mongoose.model("Project", projectSchema);