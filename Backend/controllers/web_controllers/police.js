import AlertReport from "../../models/common_models/report_crime.js";
import PoliceStation from "../../models/web_models/police_station.js";
import mongoose from "mongoose";

// Extracting data from the database and sending to the frontend for police station data analytics
export const getPoliceStationAnalytics = async (req, res) => {
  try {
    const policeStationId = req.body.stationId;
    const policeStation = await PoliceStation.findById(
      policeStationId
    ).populate("district_id");
    if (!policeStation)
      return res.status(404).json({ error: "Police station not found" });

    const alerts = await AlertReport.find({ PoliceStationID: policeStationId });

    if (!alerts.length) {
      return res.status(200).json({
        message: "No alerts found for this police station.",
      });
    }

    // Current Date Information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Filter alerts for the current month and latest 7 days
    const alertsCurrentMonth = alerts.filter(
      (alert) =>
        alert.Time.getMonth() === currentMonth &&
        alert.Time.getFullYear() === currentYear
    );
    const alertsLast7Days = alerts.filter(
      (alert) => alert.Time >= sevenDaysAgo
    );

    // Calculate Crime Types (for the current month)
    const types = alertsCurrentMonth.reduce((acc, alert) => {
      acc[alert.AlertType] = (acc[alert.AlertType] || 0) + 1;
      return acc;
    }, {});

    // Calculate Crime Counts (for the current month)
    const crimeCounts = Object.entries(types).map(([name, count]) => ({
      name,
      count,
    }));

    // Calculate Monthly and Daily Counts
    // Initialize data structures
    const monthly = {};
    const daily = {};
    const stats = {};

    // Aggregate data for monthly counts (current month), daily counts (last 7 days), and stats (current month)
    alertsCurrentMonth.forEach((alert) => {
      const alertType = alert.AlertType;
      const status = alert.Status.toLowerCase();

      // Initialize crime type in stats if not present
      if (!stats[alertType]) {
        stats[alertType] = { total: 0, pending: 0, solved: 0 };
        monthly[alertType] = Array(12).fill(0); // Monthly counts (Jan-Dec)
      }

      // Update stats
      stats[alertType].total++;
      if (status === "pending") stats[alertType].pending++;
      if (status === "closed") stats[alertType].solved++;

      // Update monthly counts
      const monthIndex = alert.Time.getMonth();
      monthly[alertType][monthIndex]++;
    });

    alertsLast7Days.forEach((alert) => {
      const alertType = alert.AlertType;

      // Initialize crime type in daily counts if not present
      if (!daily[alertType]) {
        daily[alertType] = Array(7).fill(0); // Daily counts (Sun-Sat)
      }

      // Update daily counts
      const dayIndex = alert.Time.getDay(); // 0 (Sunday) to 6 (Saturday)
      daily[alertType][dayIndex]++;
    });

    // Prepare Response
    const response = {
      stationName: policeStation.name,
      districtName: policeStation.district_id.name,
      types: Object.entries(types).map(([name, count]) => ({
        name,
        percentage: parseFloat(
          ((count / alertsCurrentMonth.length) * 100).toFixed(2)
        ), // Rounded to 2 decimal places
      })),
      crimeCounts,
      monthly,
      daily,
      stats,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all alerts with filtering
export const getAlerts = async (req, res) => {
    try {
      const { status, alertType, time, PoliceStationID } = req.query;
  
      let filter = {};
      if (PoliceStationID) filter.PoliceStationID = PoliceStationID;
      if (status && status !== "All") filter.Status = status;
      if (alertType && alertType !== "All") filter.AlertType = alertType;
  
      if (time && time !== "All") {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        let startDate, endDate;
  
        if (time === "Today") {
          startDate = new Date(today); // Start of today
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999); // End of today
        } else if (time === "Yesterday") {
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1); // Start of yesterday
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999); // End of yesterday
        } else if (time === "This Week") {
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          startDate = new Date(firstDayOfWeek);
          endDate = new Date(today);
          endDate.setHours(23, 59, 59, 999); // End of today
        }
  
        if (startDate && endDate) {
          filter.Time = { $gte: startDate, $lte: endDate };
        }
      }
  
      const alerts = await AlertReport.find(filter);
      res.status(200).json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching alerts", error });
    }
  };
  



  // filter alerts for police station 

  export const filterAlerts = async (req,res) =>{
    try {
      const { policeStationID, type, status, fromDate, toDate, priority } = req.query;
      
      // console.log(req.query);
      let query = { PoliceStationID: policeStationID };
  
      if (type) query.AlertType = type;
      if (status) query.Status = status;
      if (priority) query.Priority = priority;
      if (fromDate && toDate) {
        query.Time = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      
      // console.log(query);
      const alerts = await AlertReport.find(query);
      // console.log(alerts[2]);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }