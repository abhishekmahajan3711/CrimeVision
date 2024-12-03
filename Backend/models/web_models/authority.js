import mongoose from "mongoose";

const authoritySchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
    },
    phone:{
        type:Number,
        required:[true,"Phone number is required"],
        minlength:[10,"Phone number should be of 10 digits"],
        maxlength:[10,"Phone number should be of 10 digits"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        uinque:true,
        matich:[
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address',
          ],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password must be atleast of 8 characters"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

const Authority=mongoose.model('Authority',authoritySchema);

export default Authority;