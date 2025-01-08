import mongoose from "mongoose";
import PoliceStation from "../web_models/police_station.js";


// Define the schema
const AlertReportSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId, // Foreign key reference to User
        ref: 'User',
        required: true,
    },
    PoliceStationID: {
        type: mongoose.Schema.Types.ObjectId, // Foreign key reference to PoliceStation
        ref: 'PoliceStation',
        required: true,
    },
    AlertType: {
        type: String, // Crime type
        required: true,
    },
    Time: {
        type: Date, // Time of the alert/report
        default: Date.now,
        required: true,
    },
    Location: {
        type: String, // Location of the incident // e.g. "Location": "Lat: 18.4903, Lng: 73.8798" //  Location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` }
        required: true,
    },
    Description: {
        type: String, // Detailed description of the alert/report
        required: true,
    },
    Status: {
        type: String, // Status of the alert/report (Pending/Closed)
        enum: ['Pending', 'Closed'],
        default: 'Pending',
    },
    ActionReport: {
        type: String, // Action taken by the police station
        default: '',
    },
    Image: {
        type: String, // Path or URL of the image related to the report (optional)
        default: null,
    },
    Video: {
        type: String, // Path or URL of the video related to the report (optional)
        default: null,
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the model
const AlertReport = mongoose.model('AlertReport', AlertReportSchema);

export default AlertReport;