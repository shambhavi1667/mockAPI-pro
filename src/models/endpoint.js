const mongoose = require("mongoose");

/* ---------------- FIELD SCHEMA ---------------- */

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    required: true,
    enum: [
      "string",
      "number",
      "boolean",
      "date",
      "email",
      "uuid",
      "custom",
      "object"
    ]
  },

  required: {
    type: Boolean,
    default: false
  },

  defaultValue: {
    type: mongoose.Schema.Types.Mixed
  },

  fakerMethod: {
    type: String
  }

}, { _id: false });

// Recursive support
fieldSchema.add({
  fields: {
    type: [fieldSchema],
    default: undefined
  }
});


/* ---------------- ENDPOINT SCHEMA ---------------- */

const endpointSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  },

  path: {
    type: String,
    required: true,
    trim: true
  },

  statusCode: {
    type: Number,
    default: 200
  },

  responseSchema: {
    count: {
      type: Number,
      default: 1
    },
    fields: {
      type: [fieldSchema],
      required: true
    }
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  }

}, { timestamps: true });


/* ---------------- EXPORT ---------------- */

module.exports = mongoose.model("Endpoint", endpointSchema);