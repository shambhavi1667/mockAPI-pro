const Endpoint = require("../models/endpoint");
const Project = require("../models/project");

// CREATE ENDPOINT
const createEndpoint = async (req, res) => {
  try {
    const { method, path, statusCode, responseSchema } = req.body;

        // 🔥 Validate responseSchema exists
    if (!responseSchema || !responseSchema.fields) {
      return res.status(400).json({
        message: "responseSchema with fields is required"
      });
    }

    // 🔥 Validate fields array
    if (!Array.isArray(responseSchema.fields) || responseSchema.fields.length === 0) {
      return res.status(400).json({
        message: "At least one field is required in responseSchema"
      });
    }
    //valid count 
    if (responseSchema.count !== undefined && responseSchema.count < 1) {
  return res.status(400).json({
    message: "count must be greater than 0"
  });
}

    // Check project ownership
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const endpoint = await Endpoint.create({
      method,
      path,
      statusCode,
      responseSchema,
      projectId: project._id
    });

    res.status(201).json(endpoint);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ENDPOINTS OF PROJECT
const getEndpoints = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const endpoints = await Endpoint.find({ projectId: project._id });

    res.json(endpoints);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ENDPOINT
const updateEndpoint = async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.endpointId);

    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    Object.assign(endpoint, req.body);
    await endpoint.save();

    res.json(endpoint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ENDPOINT
const deleteEndpoint = async (req, res) => {
  try {
    const endpoint = await Endpoint.findByIdAndDelete(req.params.endpointId);

    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    res.json({ message: "Endpoint deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEndpoint,
  getEndpoints,
  updateEndpoint,
  deleteEndpoint
};