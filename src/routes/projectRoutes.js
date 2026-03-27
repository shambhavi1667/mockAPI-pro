const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectAnalytics 
} = require("../controllers/projectController");

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

router.get("/:projectId/analytics", authMiddleware, getProjectAnalytics);

module.exports = router;