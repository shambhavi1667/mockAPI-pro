const express = require("express");
const router = express.Router();

const mockController = require("../controllers/mockController");
const rateLimiter = require("../middleware/rateLimiter");
const logRequest = require("../middleware/logRequest");

// 🔥 DEBUG MIDDLEWARE
router.use("/:projectId", (req, res, next) => {
  console.log("🔥 mock route hit");
  next();
});

// Main mock handler
router.use(
  "/:projectId",
  rateLimiter,
  logRequest,
  mockController.handleMockRequest
);

module.exports = router;