import express from "express";
//importing controller functions
import {app_signup,app_signin, validate_token} from "../../controllers/app_controllers/user.js";

const app_router=express.Router();

//in the following , after comma, pass the controller function
app_router.post("/app/signup",app_signup)
app_router.post("/app/signin",app_signin)
app_router.post("/app/validatetoken",validate_token)
//similarly create other routes as per the need


export default app_router;