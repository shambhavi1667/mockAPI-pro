const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    endpoint: {
      type: String,
    },
    method: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    responseTime: {
      type: Number,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-delete logs after 30 days (VERY IMPORTANT)
requestLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

requestLogSchema.index({ projectId: 1 });

module.exports = mongoose.model("RequestLog", requestLogSchema);