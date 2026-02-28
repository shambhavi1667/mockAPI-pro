const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

const {
  createEndpoint,
  getEndpoints,
  updateEndpoint,
  deleteEndpoint
} = require("../controllers/endpointController");

// Create endpoint under project
router.post("/projects/:id/endpoints", authMiddleware, createEndpoint);

// Get endpoints of project
router.get("/projects/:id/endpoints", authMiddleware, getEndpoints);

// Update endpoint
router.put("/endpoints/:endpointId", authMiddleware, updateEndpoint);

// Delete endpoint
router.delete("/endpoints/:endpointId", authMiddleware, deleteEndpoint);

module.exports = router;