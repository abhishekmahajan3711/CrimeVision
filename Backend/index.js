import express from "express";
import cors from "cors";
import { db_connect } from "./utils/db.js";
import app_router from "./routes/app_routes/app_routes.js";
import web_router from "./routes/web_routes/web_routes.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

const app=express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
dotenv.config();
app.use("/api/v1",app_router);
app.use("/api/v1",web_router);



const port=process.env.PORT || 3000;


// Starting the server
app.listen(port, '0.0.0.0',(req,res)=>{
    console.log(`Server started at port ${port}`);
    //call function to connect to mongodb
    db_connect();

})