import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: String,
      default: "VidyaScope Admin",
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "review",
    },
    timestamp: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
