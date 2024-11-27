import express from "express"
//importing controller functions
import web_signin from "../../controllers/web_controllers/web_singin.js";

const web_router=express.Router();

//in the following , after comma, pass the controller function
web_router.use("/web/signin",web_signin)

//similarly create other routes as per the need


export default web_router;