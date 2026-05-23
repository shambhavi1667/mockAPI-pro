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
/**
 * @swagger
 * /api/projects/{id}/endpoints:
 *   post:
 *     summary: Create endpoint
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Endpoint created
 *       401:
 *         description: Unauthorized
 */
router.post("/projects/:id/endpoints", authMiddleware, createEndpoint);

// Get endpoints of project
/**
 * @swagger
 * /api/projects/{id}/endpoints:
 *   get:
 *     summary: Get all endpoints for project
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of endpoints
 */
router.get("/projects/:id/endpoints", authMiddleware, getEndpoints);

// Update endpoint
/**
 * @swagger
 * /api/endpoints/{endpointId}:
 *   put:
 *     summary: Update endpoint
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: endpointId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endpoint updated
 */
router.put("/endpoints/:endpointId", authMiddleware, updateEndpoint);

// Delete endpoint
/**
 * @swagger
 * /api/endpoints/{endpointId}:
 *   delete:
 *     summary: Delete endpoint
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: endpointId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endpoint deleted
 */
router.delete("/endpoints/:endpointId", authMiddleware, deleteEndpoint);

module.exports = router;