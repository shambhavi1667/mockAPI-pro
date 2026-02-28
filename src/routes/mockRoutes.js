// routes/mockRoutes.js

const express = require("express");
const router = express.Router();
const mockController = require("../controllers/mockController");

// Base dynamic mock route
router.all(/^\/mock\/([^\/]+)\/?(.*)/, mockController.handleMockRequest);

module.exports = router;