const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// catch everything under /mock/:projectId/...
router.all("/:projectId/*", (req, res, next) => {
  console.log("Mock route hit:", req.originalUrl);
  next();
}, mockController.handleMockRequest);

module.exports = router;