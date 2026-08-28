import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    collegeId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Official email is required"],
      lowercase: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person name is required"],
    },
    designation: {
      type: String,
      default: "Authorized Representative",
    },
    phone: {
      type: String,
      default: "",
    },
    stream: {
      type: String,
      default: "Engineering & Technology",
    },
    location: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    proofDocument: {
      name: { type: String, default: "Accreditation_Certificate.pdf" },
      size: { type: String, default: "2.1 MB" },
      type: { type: String, default: "application/pdf" },
      url: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },
    notes: {
      type: String,
      default: "",
    },
    registeredAt: {
      type: String,
      default: () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    },
  },
  { timestamps: true }
);

export const Registration = mongoose.model("Registration", registrationSchema);
