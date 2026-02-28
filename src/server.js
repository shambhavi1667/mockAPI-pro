const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const endpointRoutes = require("./routes/endpointRoutes");
const mockRoutes = require("./routes/mockRoutes");

const app = express();

// ----------------------
// Global Middleware
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// Routes
// ----------------------

// Auth (Register/Login)
app.use("/api/auth", authRoutes);

// Protected test route (optional)
app.use("/api/users", userRoutes);

// Projects CRUD
app.use("/api/projects", projectRoutes);

// Endpoints CRUD
app.use("/api", endpointRoutes);

 //dynamic mock routes
app.use("/", mockRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "MockAPI Pro Backend Running 🚀" });
});

// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error:", err));

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});