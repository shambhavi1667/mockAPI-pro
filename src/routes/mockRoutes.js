const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// Dynamic mock route
router.all("/:projectId/*", mockController.handleMockRequest);

module.exports = router;