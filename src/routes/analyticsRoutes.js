const express = require("express");

const router = express.Router();

const analyticsController = require(
  "../controllers/analyticsController"
);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics APIs
 */

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Logs APIs
 */

/**
 * @swagger
 * /api/projects/{projectId}/analytics:
 *   get:
 *     summary: Get project analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get(
  "/projects/:projectId/analytics",
  analyticsController.getProjectAnalytics
);

/**
 * @swagger
 * /api/projects/{projectId}/logs:
 *   get:
 *     summary: Get request logs
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request logs
 */
router.get(
  "/projects/:projectId/logs",
  analyticsController.getProjectLogs
);

module.exports = router;