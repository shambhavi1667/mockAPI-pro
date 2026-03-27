const RequestLog = require("../models/RequestLog");

const logRequest = (req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
        const duration = Date.now() - start;

        try {
            await RequestLog.create({
                projectId: req.params.projectId,
                endpoint: req.originalUrl, // ✅ FIXED
                method: req.method,
                statusCode: res.statusCode, // ✅ ADDED
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                responseTime: duration
            });
        } catch (err) {
            console.error("Log error:", err.message);
        }
    });

    next();
};

module.exports = logRequest;