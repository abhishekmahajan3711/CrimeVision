import WarningConfig from "../models/web_models/warning_config.js";
import { db_connect } from "./db.js";

const seedWarningConfig = async () => {
  try {
    await db_connect();
    
    // Check if configuration already exists
    const existingConfig = await WarningConfig.findOne({ isActive: true });
    
    if (existingConfig) {
      console.log("Warning configuration already exists");
      return;
    }
    
    const defaultConfig = new WarningConfig({
      name: "Default Warning Configuration",
      description: "Default thresholds for generating warnings and notifications",
      thresholds: {
        openCases: {
          warning: 6,
          notification: 10,
        },
        pendingCases: {
          warning: 6,
          notification: 10,
        },
        highPriority: {
          warning: 3,
          notification: 5,
        },
        mediumPriority: {
          warning: 8,
          notification: 15,
        },
        lowPriority: {
          warning: 15,
          notification: 25,
        },
      },
      timeFrames: {
        openCases: "7 days",
        pendingCases: "3 days",
        highPriority: "24 hours",
        mediumPriority: "3 days",
        lowPriority: "7 days",
      },
      isActive: true,
      createdBy: null, // Will be set to actual authority ID in production
    });
    
    await defaultConfig.save();
    console.log("Default warning configuration created successfully");
    
  } catch (error) {
    console.error("Error seeding warning configuration:", error);
  }
};

export default seedWarningConfig; 