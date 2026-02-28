const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route 🔐",
    user: req.user
  });
});

module.exports = router;