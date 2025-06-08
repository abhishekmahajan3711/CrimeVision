import express from "express"
//importing controller functions
import web_signin from "../../controllers/web_controllers/web_singin.js";
import verifyToken from "../../middleware/verifyToken.js";
import { getPoliceStationAnalytics,getAlerts, filterAlerts } from "../../controllers/web_controllers/police.js";
import { getDistrictAnalytics,getAlertsByDistrict, filterAlertsDistrict, getAllPoliceStations } from "../../controllers/web_controllers/district.js";
import { get_Detail_Case } from "../../controllers/server_controllers/detail_case.js";
import { updateStatus, updatePriority, addComment } from "../../controllers/server_controllers/detail_case.js";
import { getFile, UploadFile } from "../../controllers/web_controllers/pdf_controllers.js";
import { 
  getWarnings, 
  acknowledgeWarning, 
  getWarningConfig, 
  updateWarningConfig, 
  getWarningDashboard,
  checkAndGenerateWarnings 
} from "../../controllers/web_controllers/warning.js";
const web_router=express.Router();

//in the following , after comma, pass the controller function
web_router.post("/web/signin",web_signin)
web_router.post("/web/verifyToken",verifyToken)
//similarly create other routes as per the need

web_router.post("/web/police-station-analytics", getPoliceStationAnalytics);
web_router.post("/web/district-analytics",getDistrictAnalytics);
web_router.post("/web/alerts_district",getAlertsByDistrict)
web_router.get("/web/get_alerts",getAlerts);
web_router.get("/web/detail_case",get_Detail_Case);
web_router.put("/web/status/:id", updateStatus);
web_router.put("/web/priority/:id", updatePriority);
web_router.put("/web/comment/:id", addComment);
web_router.get("/web/filter_alerts_district",filterAlertsDistrict);
web_router.get("/web/filter_alerts_police",filterAlerts);

//get pdf files 

web_router.get("/web/get-files",getFile);

// Warning routes (must come before generic :districtId route)
web_router.get("/web/warnings", getWarnings);
web_router.get("/web/district/:districtId/warnings", getWarnings);
web_router.get("/web/warnings/dashboard", getWarningDashboard);
web_router.post("/web/warnings/:warningId/acknowledge", acknowledgeWarning);
web_router.get("/web/warnings/config", getWarningConfig);
web_router.put("/web/warnings/config", updateWarningConfig);
web_router.post("/web/warnings/check/:policeStationId", async (req, res) => {
  try {
    const { policeStationId } = req.params;
    const warnings = await checkAndGenerateWarnings(policeStationId, true); // Treat manual checks as alert-triggered
    res.json({ success: true, data: warnings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

//get all police stations related to all the police stations
web_router.get("/web/:districtId",getAllPoliceStations);

//pdf realted
import multer from "multer";
import path from "path";

// Configure Multer to store files with original names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./files"); // Store in "files" directory
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // Get file extension
  
      // Extract title from request body
      let title = req.body.title ? req.body.title.trim() : "untitled"; 
  
      // Ensure title is a valid filename (replace spaces with underscores, remove special characters)
      title = title.replace(/[^a-zA-Z0-9-_]/g, "_");
  
      // Prevent duplicate filenames by adding a timestamp
      const uniqueName = `${title}${ext}`;
      
      cb(null, uniqueName);
    }
  });

const upload = multer({ storage: storage });

web_router.post("/web/upload-files", upload.single("file"), UploadFile);
export default web_router;