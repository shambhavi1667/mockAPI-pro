const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// Catch all requests under /mock
router.all("*", mockController.handleMockRequest);

module.exports = router;