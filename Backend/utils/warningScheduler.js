import cron from "node-cron";
import PoliceStation from "../models/web_models/police_station.js";
import { checkAndGenerateWarnings } from "../controllers/web_controllers/warning.js";

// Schedule warning checks every 30 minutes
const startWarningScheduler = () => {
  console.log("Starting warning scheduler...");
  
  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running scheduled warning check...");
    
    try {
      // Get all police stations
      const policeStations = await PoliceStation.find({});
      
      // Check warnings for each police station
      for (const station of policeStations) {
        try {
          await checkAndGenerateWarnings(station._id, false);
        } catch (error) {
          console.error(`Error checking warnings for station ${station.name}:`, error);
        }
      }
      
      console.log(`Completed warning check for ${policeStations.length} police stations`);
    } catch (error) {
      console.error("Error in scheduled warning check:", error);
    }
  });
  
  // Also run a check every hour during peak hours (9 AM to 6 PM)
  cron.schedule("0 9-18 * * *", async () => {
    console.log("Running peak hours warning check...");
    
    try {
      const policeStations = await PoliceStation.find({});
      
      for (const station of policeStations) {
        try {
          await checkAndGenerateWarnings(station._id, false);
        } catch (error) {
          console.error(`Error in peak hours check for station ${station.name}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in peak hours warning check:", error);
    }
  });
  
  console.log("Warning scheduler started successfully");
};

export default startWarningScheduler; 