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
  getProjectAnalytics 
} = require("../controllers/projectController");

// CREATE PROJECT (with validation)
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
router.get("/", authMiddleware, getProjects);

// UPDATE PROJECT
router.put("/:id", authMiddleware, updateProject);

// DELETE PROJECT
router.delete("/:id", authMiddleware, deleteProject);

// ANALYTICS
router.get("/:projectId/analytics", authMiddleware, getProjectAnalytics);

router.get("/:id", getProjectById);

module.exports = router;