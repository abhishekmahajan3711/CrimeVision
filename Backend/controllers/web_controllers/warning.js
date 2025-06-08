import Warning from "../../models/web_models/warning.js";
import WarningConfig from "../../models/web_models/warning_config.js";
import AlertReport from "../../models/common_models/report_crime.js";
import PoliceStation from "../../models/web_models/police_station.js";
import Authority from "../../models/web_models/authority.js";
import District from "../../models/web_models/district.js";
import { io, stationSockets, districtSockets } from "../../index.js";

// Utility function to parse time frame
const parseTimeFrame = (timeFrame) => {
  const now = new Date();
  const match = timeFrame.match(/(\d+)\s*(day|hour|week)s?/i);
  
  if (!match) return now;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'hour':
      return new Date(now.getTime() - value * 60 * 60 * 1000);
    case 'day':
      return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
    default:
      return now;
  }
};

// Get case statistics for a police station within a time frame
const getCaseStatistics = async (policeStationId, timeFrame) => {
  const fromDate = parseTimeFrame(timeFrame);
  
  const pipeline = [
    {
      $match: {
        PoliceStationID: policeStationId,
        Time: { $gte: fromDate }
      }
    },
    {
      $group: {
        _id: null,
        openCases: {
          $sum: { $cond: [{ $eq: ["$Status", "Open"] }, 1, 0] }
        },
        pendingCases: {
          $sum: { $cond: [{ $eq: ["$Status", "Pending"] }, 1, 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ["$Priority", "High"] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$Priority", "Medium"] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ["$Priority", "Low"] }, 1, 0] }
        },
        caseIds: { $push: "$_id" }
      }
    }
  ];

  const result = await AlertReport.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      openCases: 0,
      pendingCases: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      caseIds: []
    };
  }
  
  return result[0];
};

// Check and generate warnings for a specific police station
export const checkAndGenerateWarnings = async (policeStationId, triggeredByNewAlert = false) => {
  try {
    const config = await WarningConfig.findOne({ isActive: true });
    if (!config) {
      console.log("No active warning configuration found");
      return;
    }

    const policeStation = await PoliceStation.findById(policeStationId).populate('district_id');
    if (!policeStation) {
      console.log("Police station not found");
      return;
    }

    const generatedWarnings = [];
    
    // Check each threshold type
    const thresholdTypes = ['openCases', 'pendingCases', 'highPriority', 'mediumPriority', 'lowPriority'];
    
    for (const thresholdType of thresholdTypes) {
      const timeFrame = config.timeFrames[thresholdType];
      const stats = await getCaseStatistics(policeStationId, timeFrame);
      const currentValue = stats[thresholdType];
      
      const warningThreshold = config.thresholds[thresholdType].warning;
      const notificationThreshold = config.thresholds[thresholdType].notification;
      
      let warningType = null;
      let threshold = 0;
      
      if (currentValue >= notificationThreshold) {
        warningType = "Notification";
        threshold = notificationThreshold;
      } else if (currentValue >= warningThreshold) {
        warningType = "Warning";
        threshold = warningThreshold;
      }
      
      if (warningType) {
        // Check if similar warning already exists and is active
        const existingWarning = await Warning.findOne({
          policeStationId,
          thresholdType: thresholdType.replace(/([A-Z])/g, '_$1').toLowerCase(),
          type: warningType,
          isActive: true
        });

        if (!existingWarning) {
          const reason = `Cases which are ${thresholdType.replace(/([A-Z])/g, ' $1').toLowerCase()} are greater than ${threshold} since last ${timeFrame}`;
          
          const newWarning = new Warning({
            policeStationId,
            type: warningType,
            reason,
            thresholdType: thresholdType.replace(/([A-Z])/g, '_$1').toLowerCase(),
            thresholdValue: threshold,
            currentValue,
            caseIds: stats.caseIds,
            caseStats: stats,
            timeFrame,
            expiresAt: new Date(Date.now() + 120 * 60 * 60 * 1000) // 24 hours
          });
          
          await newWarning.save();
          generatedWarnings.push(newWarning);
          
          // Send real-time notifications
          await sendWarningNotifications(newWarning, policeStation);
        } else {
          // Update existing warning with new data
          existingWarning.currentValue = currentValue;
          existingWarning.caseIds = stats.caseIds;
          existingWarning.caseStats = stats;
          await existingWarning.save();
        }
      }
    }
    
    // If no new warnings were generated but this was triggered by a new alert,
    // re-activate the most recent warning for this police station
    if (generatedWarnings.length === 0 && triggeredByNewAlert) {
      console.log(`No new warnings generated for ${policeStation.name}, checking for recent warnings to re-activate...`);
      
      const recentWarning = await Warning.findOne({
        policeStationId,
        isActive: true
      })
      .sort({ createdAt: -1 })
      .populate('policeStationId', 'name address');
      
      if (recentWarning) {
        // Reset acknowledgment status
        recentWarning.isAcknowledged = false;
        recentWarning.acknowledgedAt = null;
        recentWarning.updatedAt = new Date();
        await recentWarning.save();
        
        console.log(`Re-activated warning: ${recentWarning.type} for ${policeStation.name}`);
        
        // Send notification about re-activated warning
        await sendReactivatedWarningNotifications(recentWarning, policeStation);
        
        return [recentWarning]; // Return the re-activated warning
      }
    }
    
    return generatedWarnings;
  } catch (error) {
    console.error("Error checking and generating warnings:", error);
    throw error;
  }
};

// Send warning notifications via WebSocket
const sendWarningNotifications = async (warning, policeStation) => {
  try {
    const warningData = await Warning.findById(warning._id)
      .populate('policeStationId', 'name address')
      .populate('caseIds', 'AlertType Time Priority Status');

    // Notify police station
    const stationSocketId = stationSockets.get(policeStation._id.toString());
    if (stationSocketId) {
      io.to(stationSocketId).emit('new_warning', {
        warning: warningData,
        message: `New ${warning.type.toLowerCase()} generated for your station`,
        timestamp: new Date()
      });
      
      // Update notification status
      warning.notificationsSent.policeStation = true;
    }

    // Notify district officers
    // Since Authority schema doesn't have district_id or role fields,
    // we need to find the authority through the District model
    const district = await District.findById(policeStation.district_id._id).populate('authority_id');
    const districtAuthorities = district.authority_id ? [district.authority_id] : [];

    for (const authority of districtAuthorities) {
      const authoritySocketId = districtSockets.get(authority._id.toString());
      if (authoritySocketId) {
        io.to(authoritySocketId).emit('district_warning', {
          warning: warningData,
          policeStation: policeStation,
          message: `New ${warning.type.toLowerCase()} from ${policeStation.name}`,
          timestamp: new Date()
        });
        
        console.log(`District warning sent to authority ${authority._id} for station ${policeStation.name}`);
      } else {
        console.log(`District officer ${authority._id} not connected via WebSocket`);
      }
    }
    
    warning.notificationsSent.districtOfficer = true;
    await warning.save();
    
  } catch (error) {
    console.error("Error sending warning notifications:", error);
  }
};

// Send notifications for re-activated warnings
const sendReactivatedWarningNotifications = async (warning, policeStation) => {
  try {
    const warningData = await Warning.findById(warning._id)
      .populate('policeStationId', 'name address')
      .populate('caseIds', 'AlertType Time Priority Status');

    // Notify police station about re-activated warning
    const stationSocketId = stationSockets.get(policeStation._id.toString());
    if (stationSocketId) {
      io.to(stationSocketId).emit('reactivated_warning', {
        warning: warningData,
        message: `Warning re-activated due to new alert activity`,
        timestamp: new Date()
      });
      
      console.log(`Re-activated warning sent to police station ${policeStation.name}`);
    }

    // Notify district officers about re-activated warning
    const district = await District.findById(policeStation.district_id._id).populate('authority_id');
    const districtAuthorities = district.authority_id ? [district.authority_id] : [];

    for (const authority of districtAuthorities) {
      const authoritySocketId = districtSockets.get(authority._id.toString());
      if (authoritySocketId) {
        io.to(authoritySocketId).emit('district_warning', {
          warning: warningData,
          policeStation: policeStation,
          message: `Re-activated ${warning.type.toLowerCase()} from ${policeStation.name} due to new alert activity`,
          timestamp: new Date(),
          isReactivated: true
        });
        
        console.log(`Re-activated district warning sent to authority ${authority._id} for station ${policeStation.name}`);
      } else {
        console.log(`District officer ${authority._id} not connected via WebSocket`);
      }
    }
    
  } catch (error) {
    console.error("Error sending re-activated warning notifications:", error);
  }
};

// Get all warnings with filters
export const getWarnings = async (req, res) => {
  try {
    const { 
      policeStationId, 
      districtId,
      type, 
      isActive = true, 
      page = 1, 
      limit = 10,
      startDate,
      endDate
    } = req.query;
    
    // Check if districtId is provided in route params (for the district-specific endpoint)
    const routeDistrictId = req.params.districtId;

    const filter = {};
    
    if (policeStationId) {
      filter.policeStationId = policeStationId;
    } else if (districtId || routeDistrictId) {
      // Get all police stations in the district (prioritize route param)
      const targetDistrictId = routeDistrictId || districtId;
      const policeStations = await PoliceStation.find({ district_id: targetDistrictId });
      const policeStationIds = policeStations.map(ps => ps._id);
      filter.policeStationId = { $in: policeStationIds };
    }
    
    if (type) filter.type = type;
    if (isActive !== undefined) {
      // Handle both string and boolean values for isActive
      filter.isActive = typeof isActive === 'string' ? isActive === 'true' : isActive;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const warnings = await Warning.find(filter)
      .populate('policeStationId', 'name address')
      .populate('caseIds', 'AlertType Time Priority Status Description')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Warning.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: warnings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Error fetching warnings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warnings",
      error: error.message
    });
  }
};

// Acknowledge a warning
export const acknowledgeWarning = async (req, res) => {
  try {
    const { warningId } = req.params;
    const { acknowledgedBy } = req.body;

    const warning = await Warning.findByIdAndUpdate(
      warningId,
      {
        isAcknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: acknowledgedBy
      },
      { new: true }
    ).populate('policeStationId', 'name');

    if (!warning) {
      return res.status(404).json({
        success: false,
        message: "Warning not found"
      });
    }

    res.status(200).json({
      success: true,
      data: warning,
      message: "Warning acknowledged successfully"
    });
  } catch (error) {
    console.error("Error acknowledging warning:", error);
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge warning",
      error: error.message
    });
  }
};

// Get warning configuration
export const getWarningConfig = async (req, res) => {
  try {
    const config = await WarningConfig.findOne({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "No active warning configuration found"
      });
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error("Error fetching warning config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warning configuration",
      error: error.message
    });
  }
};

// Update warning configuration
export const updateWarningConfig = async (req, res) => {
  try {
    const { thresholds, timeFrames, lastModifiedBy } = req.body;

    const config = await WarningConfig.findOneAndUpdate(
      { isActive: true },
      { 
        thresholds,
        timeFrames,
        lastModifiedBy,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "No active warning configuration found"
      });
    }

    res.status(200).json({
      success: true,
      data: config,
      message: "Warning configuration updated successfully"
    });
  } catch (error) {
    console.error("Error updating warning config:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update warning configuration",
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getWarningDashboard = async (req, res) => {
  try {
    const { policeStationId } = req.query;
    
    const filter = policeStationId ? { policeStationId } : {};
    
    const stats = await Warning.aggregate([
      { $match: { ...filter, isActive: true } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          unacknowledged: {
            $sum: { $cond: [{ $eq: ["$isAcknowledged", false] }, 1, 0] }
          }
        }
      }
    ]);

    const recentWarnings = await Warning.find({ ...filter, isActive: true })
      .populate('policeStationId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        statistics: stats,
        recentWarnings
      }
    });
  } catch (error) {
    console.error("Error fetching warning dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warning dashboard",
      error: error.message
    });
  }
}; 