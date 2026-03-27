const Project = require("../models/project");
const RequestLog = require("../models/RequestLog");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      userId: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    next(error);
  }
};

// GET ALL PROJECTS
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json(projects);

  } catch (error) {
    next(error);
  }
};

// UPDATE PROJECT
const updateProject = async (req, res, next) => {
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
    next(error);
  }
};

// DELETE PROJECT
const deleteProject = async (req, res, next) => {
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
    next(error);
  }
};

// ANALYTICS
const getProjectAnalytics = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const objectId = new mongoose.Types.ObjectId(projectId);

    const totalRequests = await RequestLog.countDocuments({
      projectId: objectId
    });

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
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectAnalytics
};