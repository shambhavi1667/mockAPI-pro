import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route 🔐",
    user: req.user
  });
});

export default router;