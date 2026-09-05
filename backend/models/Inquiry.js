import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
    },
    stream: {
      type: String,
      default: "engineering",
    },
    targetScore: {
      type: String,
      default: "",
    },
    preferredLocation: {
      type: String,
      default: "",
    },
    budgetRange: {
      type: String,
      default: "under-10",
    },
    admissionYear: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    notes: {
      type: String,
      default: "",
    },
    // If the lead was generated from a specific college profile
    collegeId: {
      type: String,
      default: null,
      index: true,
    },
    collegeName: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      enum: ["counseling_modal", "counseling_page", "college_profile", "brochure_download"],
      default: "counseling_modal",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "enrolled", "closed"],
      default: "new",
      index: true,
    },
    assignedCounselor: {
      type: String,
      default: "Admissions Team",
    },
    counselorNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
