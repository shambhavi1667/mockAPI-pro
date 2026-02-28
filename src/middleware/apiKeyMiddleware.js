const Project = require("../models/project");

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.apiKey !== apiKey) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    req.project = project; // attach project for later use
    next();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = apiKeyMiddleware;