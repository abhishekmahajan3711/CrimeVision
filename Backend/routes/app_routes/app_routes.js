import express from "express";
import path from "path";
import fs from "fs";
//importing controller functions
import {app_signup,app_signin, validate_token,getCrimeAnalytics} from "../../controllers/app_controllers/user.js";
import { emergency_alert, getUserAlerts, getAlertDetails, upload } from "../../controllers/server_controllers/controllers.js";

const app_router=express.Router();

//in the following , after comma, pass the controller function
app_router.post("/app/signup",app_signup)
app_router.post("/app/signin",app_signin)
app_router.post("/app/validatetoken",validate_token)
//we have emrgency alert function in server_controllers with file upload support
app_router.post("/app/emergency_alert", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), emergency_alert)

// Get user alerts
app_router.get("/app/user/:userId/alerts", getUserAlerts);

// Get specific alert details
app_router.get("/app/alert/:alertId", getAlertDetails);


app_router.get("/app/crimeanalytics/:station",getCrimeAnalytics)

// Serve uploaded files (images and videos)
app_router.get("/app/uploads/:type/:filename", (req, res) => {
  const { type, filename } = req.params;
  
  // Validate file type
  if (type !== 'images' && type !== 'videos') {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Validate filename to prevent directory traversal attacks
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  const filePath = path.join(process.cwd(), 'uploads', type, filename);
  
  // Check if file exists first
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    if (type === 'images') {
      if (['.jpg', '.jpeg'].includes(ext)) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (ext === '.png') {
        res.setHeader('Content-Type', 'image/png');
      } else if (ext === '.gif') {
        res.setHeader('Content-Type', 'image/gif');
      } else if (ext === '.webp') {
        res.setHeader('Content-Type', 'image/webp');
      }
    } else if (type === 'videos') {
      if (ext === '.mp4') {
        res.setHeader('Content-Type', 'video/mp4');
      } else if (ext === '.webm') {
        res.setHeader('Content-Type', 'video/webm');
      } else if (ext === '.avi') {
        res.setHeader('Content-Type', 'video/x-msvideo');
      }
    }
    
    // Serve the file with proper error handling
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        // Only try to send error response if headers haven't been sent yet
        if (!res.headersSent) {
          if (err.code === 'ENOENT') {
            res.status(404).json({ error: 'File not found' });
          } else if (err.code === 'EACCES') {
            res.status(403).json({ error: 'Access denied' });
          } else {
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }
    });
  } catch (error) {
    console.error('File serving error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

//similarly create other routes as per the need

export default app_router;