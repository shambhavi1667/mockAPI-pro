const redis = require("../utils/redis");

const RATE_LIMIT = 100;
const WINDOW = 60 * 60;

const rateLimiter = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: "API_KEY_REQUIRED",
          message: "API key required"
        }
      });
    }

    const key = `rate:${apiKey}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, WINDOW);
    }

    if (requests > RATE_LIMIT) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message:
            "Too many requests. Try again later."
        }
      });
    }

    // Professional headers
    res.setHeader(
      "X-RateLimit-Limit",
      RATE_LIMIT
    );

    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, RATE_LIMIT - requests)
    );

    next();

  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};

module.exports = rateLimiter;