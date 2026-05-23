const RequestLog = require("../models/RequestLog");

exports.getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const totalRequests =
      await RequestLog.countDocuments({
        projectId
      });

    const avgResponse = await RequestLog.aggregate([
      {
        $match: {
          projectId: RequestLog.db.base.Types.ObjectId.createFromHexString(projectId)
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

    const endpointStats = await RequestLog.aggregate([
      {
        $match: {
          projectId: RequestLog.db.base.Types.ObjectId.createFromHexString(projectId)
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