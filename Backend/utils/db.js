import mongoose from "mongoose";

// const uri="mongodb+srv://abhimahajan:abhi@abhi.o2dflsk.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/CrimeVision"

export async function db_connect() {
    try{
        await mongoose.connect(uri)
    }
    catch(error){
        console.log("Error connecting to mongoDB",error);
    }
    console.log("Connected to MongoDB");
        
}