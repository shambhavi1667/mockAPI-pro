const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// Catch all dynamic routes
router.all("/:projectId/:endpoint(*)", mockController.handleMockRequest);

module.exports = router;