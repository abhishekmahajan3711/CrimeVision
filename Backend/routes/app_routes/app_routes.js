import express from "express";
//importing controller functions
import {app_signup,app_signin, validate_token} from "../../controllers/app_controllers/user.js";
import { emergency_alert } from "../../controllers/server_controllers/controllers.js";

const app_router=express.Router();

//in the following , after comma, pass the controller function
app_router.post("/app/signup",app_signup)
app_router.post("/app/signin",app_signin)
app_router.post("/app/validatetoken",validate_token)
//we have emrgency alert function in server_controllers
app_router.post("/app/emergency_alert",emergency_alert)
//similarly create other routes as per the need


export default app_router;