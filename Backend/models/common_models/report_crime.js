import mongoose from "mongoose";
import PoliceStation from "../web_models/police_station.js";

// Define the schema
const AlertReportSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId, // Foreign key reference to User
      ref: "User",
      required: true,
    },
    PoliceStationID: {
      type: mongoose.Schema.Types.ObjectId, // Foreign key reference to PoliceStation
      ref: "PoliceStation",
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
      type: String, // Location of the incident // e.g. "Location": "Lat: 18.4903, Lng: 73.8798" //  Location: Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} }
      required: true,
    },
    Description: {
      type: String, // Detailed description of the alert/report
      required: true,
    },
    Status: {
      type: String, // Status of the alert/report (Pending/Closed)
      enum: ["Pending", "Closed","Open"],
      default: "Open",
    },
    ActionReport: {
      type: String, // Action taken by the police station
      default: "",
    },
    Image: {
      type: {
        filename: {
          type: String,
          default: null,
        },
        path: {
          type: String,
          default: null,
        },
        size: {
          type: Number,
          default: null,
        },
        mimetype: {
          type: String,
          default: null,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        }
      },
      default: null,
    },
    Video: {
      type: {
        filename: {
          type: String,
          default: null,
        },
        path: {
          type: String,
          default: null,
        },
        size: {
          type: Number,
          default: null,
        },
        mimetype: {
          type: String,
          default: null,
        },
        duration: {
          type: Number,
          default: null,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        }
      },
      default: null,
    },
    Priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    Comments: [
      {
        text: {
          type: String,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    ActivityLog: [
      {
        action: {
          type: String,
        },
        performedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const AlertReport = mongoose.model("AlertReport", AlertReportSchema);

export default AlertReport;
