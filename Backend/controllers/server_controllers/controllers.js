import AlertReport from "../../models/common_models/report_crime.js";
import { io, stationSockets } from "../../index.js";
import PoliceStation from "../../models/web_models/police_station.js"; // Import PoliceStation schema

// Sample map data for police stations and their locations
const policeStations = new Map([
  //["Faraskhana Police Station", { lat: 18.5196, lng: 73.8553 }], 
  ["Khadki Police Station", { lat: 18.5636, lng: 73.8368 }], 
  //["Swargate Police Station", { lat: 18.5018, lng: 73.8581 }], 
  //["Vishrambaug Police Station", { lat: 18.5167, lng: 73.8553 }], 
  //["Shivaji Nagar Police Station", { lat: 18.5308, lng: 73.8470 }], 
  ["Deccan Police Station", { lat: 18.5165, lng: 73.8419 }], 
  //["Bharti Vidyapeeth Police Station", { lat: 18.4575, lng: 73.8521 }], 
  //["Sahakar Nagar Police Station", { lat: 18.4933, lng: 73.8675 }], 
  //["Katraj Police Station", { lat: 18.4575, lng: 73.8521 }], 
  //["Bharati Police Station", { lat: 18.4575, lng: 73.8521 }], 
  ["Kondhwa Police Station", { lat: 18.4575, lng: 73.8890 }], 
  ["Koregaon Park Police Station", { lat: 18.5362, lng: 73.8936 }], 
  ["Mundhwa Police Station", { lat: 18.5393, lng: 73.9250 }], 
  //["Airport Police Station", { lat: 18.5803, lng: 73.9197 }], 
  ["Hadapsar Police Station", { lat: 18.5089, lng: 73.9250 }], 
  //["Chandan Nagar Police Station", { lat: 18.5615, lng: 73.9343 }], 
  //["Ramwadi Police Station", { lat: 18.5615, lng: 73.9343 }], 
  //["Yerwada Police Station", { lat: 18.5522, lng: 73.8995 }], 
  //["Vimantal Police Station", { lat: 18.5803, lng: 73.9197 }], 
  //["Warje Police Station", { lat: 18.4802, lng: 73.8070 }], 
  ["Dattawadi Police Station", { lat: 18.4966, lng: 73.8414 }], 
  ["Market Yard Police Station", { lat: 18.4933, lng: 73.8675 }], 
  //["Chaturshrungi Police Station", { lat: 18.5408, lng: 73.8258 }], 
  ["Dighi Police Station", { lat: 18.6180, lng: 73.8470 }], 
  //["Bhosari Police Station", { lat: 18.6298, lng: 73.8470 }], 
  ["Nigdi Police Station", { lat: 18.6622, lng: 73.7721 }], 
]);


// Haversine formula to calculate the distance between two latitude/longitude points
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

export const emergency_alert = async (req, res) => {
  try {
    const {
      userId,
      alertType,
      location,
      description,
      image,
      video,
    } = req.body;

    // Extract latitude and longitude from the location string
    const [lat, lng] = location
      .replace("Lat:", "")
      .replace("Lng:", "")
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Find the nearest police station
    let nearestStationName = null;
    let shortestDistance = Infinity;

    policeStations.forEach((stationLocation, stationName) => {
      const distance = haversineDistance(
        lat,
        lng,
        stationLocation.lat,
        stationLocation.lng
      );

      console.log(stationName,distance);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestStationName = stationName;
      }
    });

    if (!nearestStationName) {
      return res.status(404).json({
        message: "No police station found near the given location.",
      });
    }

    // Fetch police station ID from the database
    const policeStation = await PoliceStation.findOne({
      name: nearestStationName,
    });

    if (!policeStation) {
      return res.status(404).json({
        message: `Police station "${nearestStationName}" not found in the database.`,
      });
    }

    const nearestStationId = policeStation._id;

    // Prepare alert data
    const alert = {
      UserID: userId,
      PoliceStationID: nearestStationId,
      AlertType: alertType,
      Location: location,
      Description: description,
      Image: image || null,
      Video: video || null,
    };

     //will use when required
    // Save the alert to the database
    // const alert = await AlertReport.create({
    //   UserID: userId,
      // PoliceStationID: nearestStationId,
      // AlertType: alertType,
      // Location: location,
      // Description: description,
      // Image: image || null,
      // Video: video || null,
    // });


    // Notify the police station via WebSocket
    const socketId = stationSockets.get(nearestStationId.toString());

    if (socketId) {
      io.to(socketId).emit("new-alert", alert); // Emit alert to the specific police station
      console.log(`Alert sent to Police Station ${nearestStationId}:`);
    } else {
      console.log(`Police Station ${nearestStationId} is not connected.`);
    }

    res
      .status(201)
      .json({ message: "Alert created and sent successfully.", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
