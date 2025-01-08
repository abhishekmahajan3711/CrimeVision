import express from "express"
//importing controller functions
import web_signin from "../../controllers/web_controllers/web_singin.js";
import verifyToken from "../../middleware/verifyToken.js";
import { getPoliceStationAnalytics } from "../../controllers/web_controllers/police.js";
import { getDistrictAnalytics,getAlertsByDistrict } from "../../controllers/web_controllers/district.js";

const web_router=express.Router();

//in the following , after comma, pass the controller function
web_router.post("/web/signin",web_signin)
web_router.post("/web/verifyToken",verifyToken)
//similarly create other routes as per the need

web_router.post("/web/police-station-analytics", getPoliceStationAnalytics);
web_router.post("/web/district-analytics",getDistrictAnalytics);
web_router.post("/web/alerts_district",getAlertsByDistrict)

export default web_router;