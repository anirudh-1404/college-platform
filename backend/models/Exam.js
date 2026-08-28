import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exam name is required"],
      trim: true,
    },
    shortName: {
      type: String,
      required: [true, "Short name is required"],
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
      required: true,
      enum: [
        "engineering",
        "management",
        "medical",
        "law",
        "design",
        "applied-sciences",
      ],
      default: "engineering",
    },
    conductingBody: {
      type: String,
      default: "National Testing Agency (NTA)",
    },
    level: {
      type: String,
      default: "National Level",
    },
    mode: {
      type: String,
      default: "Computer Based Test (CBT)",
    },
    frequency: {
      type: String,
      default: "Once a year",
    },
    duration: {
      type: String,
      default: "180 Minutes (3 Hours)",
    },
    totalMarks: {
      type: String,
      default: "300 Marks",
    },
    eligibility: {
      type: String,
      default: "10+2 with relevant subjects (min 50-75%)",
    },
    examDates: {
      applicationStart: { type: String, default: "November 2025" },
      applicationEnd: { type: String, default: "January 2026" },
      admitCardDate: { type: String, default: "April 2026" },
      examDate: { type: String, default: "May 2026" },
      resultDate: { type: String, default: "June 2026" },
    },
    targetCollegesCount: {
      type: String,
      default: "Top National Universities & Institutes",
    },
    overview: {
      type: String,
      default: "",
    },
    syllabusHighlights: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
