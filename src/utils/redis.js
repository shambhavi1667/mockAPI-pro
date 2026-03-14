const Redis = require("ioredis");

console.log("REDIS_URL:", process.env.REDIS_URL); // 👈 Debug line

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

module.exports = redis;