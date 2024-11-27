import express from "express";
//importing controller functions
import {app_signup,app_signin} from "../../controllers/app_controllers/user.js";

const app_router=express.Router();

//in the following , after comma, pass the controller function
app_router.use("/app/signup",app_signup)
app_router.use("/app/singin",app_signin)

//similarly create other routes as per the need


export default app_router;