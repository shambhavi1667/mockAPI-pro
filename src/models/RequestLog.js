const mongoose = require("mongoose");

const requestLogSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    endpoint: String,
    method: String,
    ip: String,
    userAgent: String,
    responseTime: Number
}, { timestamps: true });

module.exports = mongoose.model("RequestLog", requestLogSchema);