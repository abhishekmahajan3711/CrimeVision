import express from "express"
//importing controller functions
import web_signin from "../../controllers/web_controllers/web_singin.js";
import verifyToken from "../../middleware/verifyToken.js";

const web_router=express.Router();

//in the following , after comma, pass the controller function
web_router.post("/web/signin",web_signin)
web_router.post("/web/verifyToken",verifyToken)
//similarly create other routes as per the need


export default web_router;