import mongoose from "mongoose";

const careerGuideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Career title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Engineering & Technology",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    author: {
      type: String,
      default: "VidyaScope Editorial Team",
    },
    summary: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    averageSalary: {
      type: String,
      default: "₹12 - 25 LPA",
    },
    eligibility: {
      type: String,
      default: "10+2 with relevant subjects",
    },
    requiredDegrees: {
      type: [String],
      default: [],
    },
    targetExams: {
      type: [String],
      default: [],
    },
    topRecruiters: {
      type: [String],
      default: [],
    },
    roadmapSteps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        duration: { type: String, default: "1-2 Years" },
      },
    ],
    content: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const CareerGuide = mongoose.model("CareerGuide", careerGuideSchema);

