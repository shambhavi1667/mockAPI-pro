const mongoose = require("mongoose");
const Endpoint = require("../models/endpoint");
const Project = require("../models/project");
const { faker } = require("@faker-js/faker");

/* ----------------------------------
   Route Matcher
----------------------------------- */
function matchRoute(dbPath, requestedPath) {
  const dbParts = dbPath.split("/").filter(Boolean);
  const reqParts = requestedPath.split("/").filter(Boolean);

  if (dbParts.length !== reqParts.length) return false;

  for (let i = 0; i < dbParts.length; i++) {
    if (dbParts[i].startsWith(":")) continue;
    if (dbParts[i] !== reqParts[i]) return false;
  }

  return true;
}

/* ----------------------------------
   Data Generation Engine
----------------------------------- */
function generateField(field) {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  if (field.fakerMethod) {
    try {
      const fakerParts = field.fakerMethod.split(".");
      let fakerMethod = faker;

      for (const part of fakerParts) {
        if (!fakerMethod[part]) return null;
        fakerMethod = fakerMethod[part];
      }

      if (typeof fakerMethod === "function") {
        return fakerMethod();
      }
    } catch (err) {
      console.error("Invalid faker method:", field.fakerMethod);
      return null;
    }
  }

  switch (field.type) {
    case "string":
      return faker.lorem.word();

    case "number":
      return faker.number.int({ min: 0, max: 100 });

    case "boolean":
      return faker.datatype.boolean();

    case "email":
      return faker.internet.email();

    case "uuid":
      return faker.string.uuid();

    case "date":
      return faker.date.recent();

    case "object":
      return generateObject(field.fields || []);

    case "array":
      const arr = [];
      const arrCount = field.count || 1;

      for (let i = 0; i < arrCount; i++) {
        arr.push(generateObject(field.fields || []));
      }
      return arr;

    default:
      return null;
  }
}

function generateObject(fields = []) {
  const obj = {};

  for (const field of fields) {
    if (!field.name) continue;
    obj[field.name] = generateField(field);
  }

  return obj;
}

/* ----------------------------------
   Main Mock Handler
----------------------------------- */
exports.handleMockRequest = async (req, res) => {
  try {
    console.log("🔥 mock route hit");
    console.log("Params:", req.params);
    console.log("Original URL:", req.originalUrl);

    const projectId = req.params.projectId;

    // ✅ FIXED PATH EXTRACTION
    const basePath = `/mock/${projectId}`;
    const dynamicPath = req.originalUrl.replace(basePath, "");
    const requestedPath = dynamicPath || "/";

    const method = req.method.toUpperCase();

    console.log("Requested Path:", requestedPath);

    /* ----------------------------
       1️⃣ Validate Project
    ----------------------------- */
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: "PROJECT_NOT_FOUND",
          message: "Project not found"
        }
      });
    }

    /* ----------------------------
       2️⃣ API Key Validation
    ----------------------------- */
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== project.apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or missing API key"
        }
      });
    }

    /* ----------------------------
       3️⃣ Find Matching Endpoint
    ----------------------------- */
    const endpoints = await Endpoint.find({
      projectId: new mongoose.Types.ObjectId(projectId),
      method: method
    });

    let matchedEndpoint = null;

    for (const endpoint of endpoints) {
      // ✅ NORMALIZE DB PATH
      const normalizedDbPath = endpoint.path.startsWith("/")
        ? endpoint.path
        : "/" + endpoint.path;

      if (matchRoute(normalizedDbPath, requestedPath)) {
        matchedEndpoint = endpoint;
        break;
      }
    }

    if (!matchedEndpoint) {
      return res.status(404).json({
        success: false,
        error: {
          code: "ENDPOINT_NOT_FOUND",
          message: "Endpoint not found"
        }
      });
    }

    /* ----------------------------
       4️⃣ Delay Simulation
    ----------------------------- */
    const delay = matchedEndpoint.delay || 0;

    if (delay > 0) {
      await new Promise(resolve =>
        setTimeout(resolve, Number(delay))
      );
    }

    /* ----------------------------
       5️⃣ Custom Headers
    ----------------------------- */
    if (matchedEndpoint.headers) {
      for (const key in matchedEndpoint.headers) {
        res.setHeader(key, matchedEndpoint.headers[key]);
      }
    }

    /* ----------------------------
       6️⃣ Generate Response
    ----------------------------- */
    const { fields, count } = matchedEndpoint.responseSchema || {};

    if (!fields || fields.length === 0) {
      return res.status(matchedEndpoint.statusCode || 200).json({});
    }

    const results = [];

    for (let i = 0; i < (count || 1); i++) {
      results.push(generateObject(fields));
    }

    return res
      .status(matchedEndpoint.statusCode || 200)
      .json(results);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong"
      }
    });
  }
};