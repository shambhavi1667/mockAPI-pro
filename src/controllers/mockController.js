const Endpoint = require("../models/endpoint");
const { faker } = require("@faker-js/faker");

/* ----------------------------------
   Route Matcher (Day 8–9)
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
   Data Generation Engine (Day 10–11)
----------------------------------- */

function generateField(field) {
  // 1️⃣ Default value support
  if (field.default !== undefined) {
    return field.default;
  }

  // 2️⃣ Custom faker method support (e.g., "internet.email")
  if (field.faker) {
    try {
      const fakerParts = field.faker.split(".");
      let fakerMethod = faker;

      for (const part of fakerParts) {
        if (!fakerMethod[part]) return null;
        fakerMethod = fakerMethod[part];
      }

      if (typeof fakerMethod === "function") {
        return fakerMethod();
      }
    } catch (err) {
      console.error("Invalid faker method:", field.faker);
      return null;
    }
  }

  // 3️⃣ Built-in type handling
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
    const projectId = req.params[0];
    const dynamicPath = req.params[1];

    const method = req.method;
    const requestedPath = "/" + (dynamicPath || "");

    // Find endpoints for this project + method
    const endpoints = await Endpoint.find({
      projectId: projectId,
      method: method
    });

    let matchedEndpoint = null;

    for (const endpoint of endpoints) {
      if (matchRoute(endpoint.path, requestedPath)) {
        matchedEndpoint = endpoint;
        break;
      }
    }

    if (!matchedEndpoint) {
      return res.status(404).json({
        message: "Endpoint not found"
      });
    }

    const { fields, count } = matchedEndpoint.responseSchema || {};

    if (!fields || fields.length === 0) {
      return res.status(200).json({});
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
    res.status(500).json({ message: "Server error" });
  }
};