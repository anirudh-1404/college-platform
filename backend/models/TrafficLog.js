import mongoose from "mongoose";

const trafficLogSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },
    pageTitle: {
      type: String,
      default: "",
    },
    pageType: {
      type: String,
      enum: [
        "home",
        "college_detail",
        "college_listing",
        "courses",
        "exams",
        "compare",
        "counseling",
        "blogs",
        "blog_detail",
        "career_guide",
        "shortlist",
        "other",
      ],
      default: "other",
    },
    collegeId: {
      type: String,
      default: null,
      index: true,
    },
    collegeName: {
      type: String,
      default: null,
    },
    ip: {
      type: String,
      default: "anonymous",
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Desktop",
    },
    browser: {
      type: String,
      default: "Chrome",
    },
    os: {
      type: String,
      default: "Unknown",
    },
    referrer: {
      type: String,
      default: "Direct",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "India",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

trafficLogSchema.index({ timestamp: -1 });
trafficLogSchema.index({ collegeId: 1, timestamp: -1 });

export const TrafficLog = mongoose.model("TrafficLog", trafficLogSchema);
