const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// Catch all routes under /mock
router.all("/*path", mockController.handleMockRequest);

module.exports = router;