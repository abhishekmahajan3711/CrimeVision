import mongoose from "mongoose";
import Authority from "./authority.js";
import District from "./district.js";

const police_stationSchema=new mongoose.Schema({
    authority_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: Authority
    },
    district_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:District
    },
    name:{
        type:String,
        required:true
    },
    no_of_cases_this_month:{
        type:Number,
        default:0
    },
    no_of_cases_last_month:{
        type:Number,
        default:0
    }
})

const PoliceStation=mongoose.model('PoliceStation',police_stationSchema);

export default PoliceStation;