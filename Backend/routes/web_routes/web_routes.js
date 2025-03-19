import express from "express"
//importing controller functions
import web_signin from "../../controllers/web_controllers/web_singin.js";
import verifyToken from "../../middleware/verifyToken.js";
import { getPoliceStationAnalytics,getAlerts } from "../../controllers/web_controllers/police.js";
import { getDistrictAnalytics,getAlertsByDistrict } from "../../controllers/web_controllers/district.js";
import { get_Detail_Case } from "../../controllers/server_controllers/detail_case.js";
import { updateStatus, updatePriority, addComment } from "../../controllers/server_controllers/detail_case.js";
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

export default web_router;