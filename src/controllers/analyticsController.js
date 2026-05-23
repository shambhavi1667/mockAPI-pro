const RequestLog = require("../models/RequestLog");
const mongoose = require("mongoose");

// GET ANALYTICS
exports.getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const objectId =
      new mongoose.Types.ObjectId(projectId);

    // Total requests
    const totalRequests =
      await RequestLog.countDocuments({
        projectId: objectId
      });

    // Average response time
    const avgResponse = await RequestLog.aggregate([
      {
        $match: {
          projectId: objectId
        }
      },

      {
        $group: {
          _id: null,

          avgResponseTime: {
            $avg: "$responseTime"
          }
        }
      }
    ]);

    // Endpoint statistics
    const endpointStats =
      await RequestLog.aggregate([
        {
          $match: {
            projectId: objectId
          }
        },

        {
          $group: {
            _id: "$endpoint",
            count: { $sum: 1 }
          }
        },

        {
          $sort: {
            count: -1
          }
        }
      ]);

    return res.json({
      success: true,

      analytics: {
        totalRequests,

        avgResponseTime:
          avgResponse[0]?.avgResponseTime || 0,

        endpointStats
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error: {
        code: "ANALYTICS_ERROR",
        message: "Failed to fetch analytics"
      }
    });
  }
};

// GET REQUEST LOGS
exports.getProjectLogs = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Pagination
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Filters
    const filter = {
      projectId
    };

    // Optional status code filter
    if (req.query.statusCode) {
      filter.statusCode =
        Number(req.query.statusCode);
    }

    // Optional method filter
    if (req.query.method) {
      filter.method =
        req.query.method.toUpperCase();
    }

    // Total logs count
    const total =
      await RequestLog.countDocuments(filter);

    // Fetch paginated logs
    const logs = await RequestLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit)
      },

      logs
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error: {
        code: "LOG_FETCH_ERROR",
        message: "Failed to fetch logs"
      }
    });
  }
};