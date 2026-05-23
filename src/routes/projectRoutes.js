const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { body } = require("express-validator");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectAnalytics,
  getProjectLogs
} = require("../controllers/projectController");

// CREATE PROJECT (with validation)
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  [
    body("name")
      .notEmpty()
      .withMessage("Project name is required")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters")
  ],
  createProject
);

// GET ALL PROJECTS
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getProjects);

// UPDATE PROJECT
/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
router.put("/:id", authMiddleware, updateProject);

// DELETE PROJECT
/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete("/:id", authMiddleware, deleteProject);

// ANALYTICS
router.get("/:projectId/analytics", authMiddleware, getProjectAnalytics);

router.get("/:id/logs", authMiddleware, getProjectLogs);

router.get("/:id", authMiddleware, getProjectById);


module.exports = router;