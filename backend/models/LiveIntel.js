import mongoose from "mongoose";

const liveIntelSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Live intel text is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "LIVE INTEL",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const LiveIntel = mongoose.model("LiveIntel", liveIntelSchema);
