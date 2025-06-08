import mongoose from "mongoose";

const WarningConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    thresholds: {
      openCases: {
        warning: { type: Number, default: 10 },
        notification: { type: Number, default: 15 },
      },
      pendingCases: {
        warning: { type: Number, default: 8 },
        notification: { type: Number, default: 12 },
      },
      highPriority: {
        warning: { type: Number, default: 5 },
        notification: { type: Number, default: 8 },
      },
      mediumPriority: {
        warning: { type: Number, default: 15 },
        notification: { type: Number, default: 20 },
      },
      lowPriority: {
        warning: { type: Number, default: 25 },
        notification: { type: Number, default: 30 },
      },
    },
    timeFrames: {
      openCases: { type: String, default: "7 days" },
      pendingCases: { type: String, default: "3 days" },
      highPriority: { type: String, default: "24 hours" },
      mediumPriority: { type: String, default: "3 days" },
      lowPriority: { type: String, default: "7 days" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
      required: false,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
    },
  },
  {
    timestamps: true,
  }
);

const WarningConfig = mongoose.model("WarningConfig", WarningConfigSchema);

export default WarningConfig; 