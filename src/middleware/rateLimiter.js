const redis = require("../utils/redis");

const RATE_LIMIT = 100;       // requests
const WINDOW = 60 * 60;      // 1 hour in seconds

const rateLimiter = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        error: "API key required"
      });
    }

    const key = `rate:${apiKey}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, WINDOW);
    }

    if (requests > RATE_LIMIT) {
      return res.status(429).json({
        error: "Too many requests. Try again later."
      });
    }

    next();

  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};

module.exports = rateLimiter;