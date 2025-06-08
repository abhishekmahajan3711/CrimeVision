import mongoose from "mongoose";
import PoliceStation from "./police_station.js";
import AlertReport from "../common_models/report_crime.js";

const WarningSchema = new mongoose.Schema(
  {
    policeStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
      required: true,
    },
    type: {
      type: String,
      enum: ["Warning", "Notification"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    thresholdType: {
      type: String,
      enum: ["open_cases", "pending_cases", "high_priority", "medium_priority", "low_priority"],
      required: true,
    },
    thresholdValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    caseIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlertReport",
    }],
    caseStats: {
      openCases: { type: Number, default: 0 },
      pendingCases: { type: Number, default: 0 },
      highPriority: { type: Number, default: 0 },
      mediumPriority: { type: Number, default: 0 },
      lowPriority: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAcknowledged: {
      type: Boolean,
      default: false,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    notificationsSent: {
      policeStation: { type: Boolean, default: false },
      districtOfficer: { type: Boolean, default: false },
    },
    timeFrame: {
      type: String,
      default: "7 days", // e.g., "7 days", "24 hours"
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
WarningSchema.index({ policeStationId: 1, isActive: 1 });
WarningSchema.index({ type: 1, isActive: 1 });
WarningSchema.index({ createdAt: -1 });

const Warning = mongoose.model("Warning", WarningSchema);

export default Warning;
