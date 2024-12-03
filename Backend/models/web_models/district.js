import mongoose from "mongoose";
import Authority from "./authority.js";

const districtSchema=new mongoose.Schema({
    authority_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: Authority
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

const District=mongoose.model('District',districtSchema);

export default District;