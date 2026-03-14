const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");
const rateLimiter = require("../middleware/rateLimiter");

// Catch all routes under /mock
router.all("/*path", rateLimiter, mockController.handleMockRequest);

module.exports = router;