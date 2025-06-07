import AlertReport from "../../models/common_models/report_crime.js";
import { io, stationSockets } from "../../index.js";
import PoliceStation from "../../models/web_models/police_station.js"; // Import PoliceStation schema
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const videosDir = path.join(uploadsDir, 'videos');

[uploadsDir, imagesDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, imagesDir);
    } else if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for image field'), false);
    }
  } else if (file.fieldname === 'video') {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for video field'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// Configure multer with size limits
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2, // Maximum 2 files (1 image + 1 video)
  }
});

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

// Helper function to handle base64 image uploads
const handleBase64Image = async (base64Data) => {
  try {
    // Extract the base64 data and mime type
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 format');
    }

    const mimeType = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, 'base64');

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = mimeType.split('/')[1];
    const filename = `image-${uniqueSuffix}.${fileExtension}`;
    const filepath = path.join(imagesDir, filename);

    // Save file to disk
    fs.writeFileSync(filepath, buffer);

    return {
      filename: filename,
      path: filepath,
      size: buffer.length,
      mimetype: mimeType,
    };
  } catch (error) {
    console.error('Error handling base64 image:', error);
    throw error;
  }
};

// Get all alerts by user ID
export const getUserAlerts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    // Fetch all alerts for the user
    const alerts = await AlertReport.find({ UserID: userId })
      .populate('PoliceStationID', 'name district')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      message: "User alerts fetched successfully",
      alerts: alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Error fetching user alerts:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get specific alert details by alert ID
export const getAlertDetails = async (req, res) => {
  try {
    const { alertId } = req.params;

    if (!alertId) {
      return res.status(400).json({
        message: "alertId is required",
      });
    }

    // Fetch the specific alert with police station details
    const alert = await AlertReport.findById(alertId)
      .populate('PoliceStationID', 'name district contactInfo');

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    res.status(200).json({
      message: "Alert details fetched successfully",
      alert: alert
    });

  } catch (error) {
    console.error('Error fetching alert details:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const emergency_alert = async (req, res) => {
  try {
    const {
      userId,
      alertType,
      location,
      description,
      image,
    } = req.body;

    console.log('Received alert request body:', req.body);
    console.log('Received alert from user:', userId);
    console.log('Files received:', req.files);

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!alertType) {
      return res.status(400).json({
        message: "alertType is required",
      });
    }

    if (!location) {
      return res.status(400).json({
        message: "location is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "description is required",
      });
    }

    // Validate location format
    if (typeof location !== 'string' || !location.includes('Lat:') || !location.includes('Lng:')) {
      return res.status(400).json({
        message: "Invalid location format. Expected format: 'Lat: X, Lng: Y'",
      });
    }

    // Extract latitude and longitude from the location string
    let lat, lng;
    try {
      const coords = location
        .replace("Lat:", "")
        .replace("Lng:", "")
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      
      [lat, lng] = coords;
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates");
      }
    } catch (error) {
      return res.status(400).json({
        message: "Invalid location coordinates",
        error: error.message,
      });
    }

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

      console.log(stationName, distance);
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
    const alertData = {
      UserID: userId,
      PoliceStationID: nearestStationId,
      AlertType: alertType,
      Location: location,
      Priority: "Low",
      Status: "Pending",
      Description: description,
    };

    // Handle image upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      alertData.Image = {
        filename: imageFile.filename,
        path: imageFile.path,
        size: imageFile.size,
        mimetype: imageFile.mimetype,
      };
    } else if (image && image.startsWith('data:image')) {
      // Handle base64 image
      try {
        const imageData = await handleBase64Image(image);
        alertData.Image = imageData;
      } catch (error) {
        console.error('Error processing base64 image:', error);
      }
    }

    // Handle video upload
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      alertData.Video = {
        filename: videoFile.filename,
        path: videoFile.path,
        size: videoFile.size,
        mimetype: videoFile.mimetype,
      };
    }

    // Save the alert to the database
    const alert = await AlertReport.create(alertData);

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
      .json({ 
        message: "Alert created and sent successfully.", 
        alert,
        nearestStation: nearestStationName,
        distance: shortestDistance.toFixed(2) + " km",
        files: {
          image: alertData.Image ? true : false,
          video: alertData.Video ? true : false,
        }
      });
  } catch (err) {
    console.error('Emergency alert error:', err);
    
    // Clean up uploaded files if there was an error
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error.", 
      error: err.message 
    });
  }
};
