import AlertReport from "../../models/common_models/report_crime.js";
import PoliceStation from "../../models/web_models/police_station.js";
import District from "../../models/web_models/district.js";
import mongoose from "mongoose";

// Helper function to get the start and end of the current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

export const getDistrictAnalytics = async (req, res) => {
    try {
      const { start, end } = getCurrentMonthRange();
      const districtId = req.body.districtId; // Expecting districtId in the request body
  
      // Fetch all police stations in the district
      const policeStations = await PoliceStation.find({ district_id: districtId });
      const policeStationIds = policeStations.map((ps) => ps._id);
  
      // Get the start of the latest 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today
  
      // Aggregate data for the current month
      const reports = await AlertReport.aggregate([
        {
          $match: {
            PoliceStationID: { $in: policeStationIds },
            Time: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: {
              PoliceStationID: "$PoliceStationID",
              AlertType: "$AlertType",
              day: { $dayOfMonth: "$Time" },
              month: { $month: "$Time" },
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$Time" },
              },
            },
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Prepare the response structure
      const data = {};
      const crimeTypes = await AlertReport.distinct("AlertType");
      const stations = policeStations.map((ps) => ps.name);
  
      stations.forEach((station) => {
        data[station] = {
          totalCases: 0,
          solvedCases: 0, // Placeholder for solved cases (can be calculated separately)
          unsolvedCases: 0, // Placeholder for unsolved cases (can be calculated separately)
          monthly: {},
          daily: {},
          types: [],
        };
  
        // Initialize monthly and daily arrays for each crime type
        crimeTypes.forEach((type) => {
          data[station].monthly[type] = Array(12).fill(0); // Initialize monthly data for all months
          data[station].daily[type] = Array(7).fill(0); // Initialize daily data for the latest 7 days
        });
      });
  
      reports.forEach((report) => {
        const policeStation = policeStations.find(
          (ps) => ps._id.toString() === report._id.PoliceStationID.toString()
        );
  
        if (policeStation) {
          const stationName = policeStation.name;
          const crimeType = report._id.AlertType;
          const day = report._id.day - 1; // Zero-based index for monthly data
          const month = report._id.month - 1; // Zero-based index for monthly data
          const reportDate = new Date(report._id.date);
  
          // Update total cases
          data[stationName].totalCases += report.count;
  
          // Update monthly data
          data[stationName].monthly[crimeType][month] += report.count;
  
          // Update daily data for the latest 7 days
          if (reportDate >= sevenDaysAgo && reportDate <= today) {
            const dayIndex = Math.floor(
              (reportDate - sevenDaysAgo) / (1000 * 60 * 60 * 24)
            ); // Calculate index for the latest 7 days
            data[stationName].daily[crimeType][dayIndex] += report.count;
          }
  
          // Update types array
          const typeIndex = data[stationName].types.findIndex((t) => t.type === crimeType);
          if (typeIndex === -1) {
            data[stationName].types.push({ type: crimeType, count: report.count });
          } else {
            data[stationName].types[typeIndex].count += report.count;
          }
        }
      });
  
      // Calculate solved and unsolved cases if data is available
      Object.keys(data).forEach((station) => {
        data[station].solvedCases = Math.floor(data[station].totalCases * 0.3); // Example: 30% solved
        data[station].unsolvedCases = data[station].totalCases - data[station].solvedCases;
      });
  
      res.status(200).json({
        stations,
        crimeTypes,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  };
  



  //get all alerts/crimes related to particular district

  import moment from 'moment';  // You can install moment.js to easily manipulate dates

  export const getAlertsByDistrict = async (req, res) => {
    try {
      const { districtId } = req.body;
  
      // Fetch all police stations in the district, including the name
      const policeStations = await PoliceStation.find({ district_id: districtId }).select('_id name');
  
      if (!policeStations || policeStations.length === 0) {
        return res.status(404).json({ message: "No police stations found for the given district." });
      }
  
      // Create a map of PoliceStationID to PoliceStationName
      const policeStationMap = policeStations.reduce((acc, ps) => {
        acc[ps._id.toString()] = ps.name; // Assuming _id is an ObjectId and needs to be converted to string
        return acc;
      }, {});
  
      // Get the current month's start and end dates
      const startOfMonth = moment().startOf('month').toDate();
      const endOfMonth = moment().endOf('month').toDate();
  
      // Fetch all alerts for the police stations in the district for the current month
      const alerts = await AlertReport.find({
        PoliceStationID: { $in: Object.keys(policeStationMap) },
        Time: { $gte: startOfMonth, $lte: endOfMonth }  // Filter alerts for the current month
      });
  
      // Map each alert to include the police station name instead of the ID
      const alertsWithNames = alerts.map((alert) => {
        const policeStationName = policeStationMap[alert.PoliceStationID.toString()];
        return {
          ...alert.toObject(), // Spread the alert data
          PoliceStationName: policeStationName, // Add the police station name
          // Optionally, you can remove the PoliceStationID field if you don't want it in the response
          // PoliceStationID: undefined 
        };
      });
  
      res.status(200).json(alertsWithNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving alerts", error: error.message });
    }
  };
  
