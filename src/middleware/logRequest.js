const RequestLog = require("../models/RequestLog");

const logRequest = (req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
        const duration = Date.now() - start;

        try {
            await RequestLog.create({
                projectId: req.params.projectId,
                endpoint: req.params[0],
                method: req.method,
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                responseTime: duration
            });
        } catch (err) {
            console.error("Log error:", err);
        }
    });

    next();
};

module.exports = logRequest;