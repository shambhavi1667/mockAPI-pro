const Project = require("../models/project");
const RequestLog = require("../models/RequestLog");
const mongoose = require("mongoose");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      userId: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 ANALYTICS FUNCTION (NEW)
const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const objectId = new mongoose.Types.ObjectId(projectId);

    // Total requests
    const totalRequests = await RequestLog.countDocuments({
      projectId: objectId
    });

    // Top endpoints
    const topEndpoints = await RequestLog.aggregate([
      { $match: { projectId: objectId } },
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Requests over time
    const requestsOverTime = await RequestLog.aggregate([
      { $match: { projectId: objectId } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalRequests,
      topEndpoints,
      requestsOverTime
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Analytics error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectAnalytics
};