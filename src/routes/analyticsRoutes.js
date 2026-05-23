const express = require("express");

const router = express.Router();

const analyticsController = require(
  "../controllers/analyticsController"
);

router.get(
  "/projects/:projectId/analytics",
  analyticsController.getProjectAnalytics
);

module.exports = router;