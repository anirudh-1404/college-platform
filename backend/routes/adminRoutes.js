import express from "express";
import {
  getAdminAnalytics,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
  getAllProfiles,
  approveAndPublishProfile,
  requestProfileChanges,
  unpublishProfile,
  updatePlatformData,
  getAdminUsers,
  addAdminUser,
  deleteAdminUser,
  getAuditLogs,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../utils/authMiddleware.js";

const router = express.Router();

// Require Admin Auth for all admin routes
router.use(verifyToken, isAdmin);

// Analytics
router.get("/analytics", getAdminAnalytics);

// Registration Requests
router.get("/registrations", getRegistrations);
router.post("/registrations/:id/approve", approveRegistration);
router.post("/registrations/:id/reject", rejectRegistration);

// College Profiles CMS Review
router.get("/profiles", getAllProfiles);
router.post("/profiles/:id/publish", approveAndPublishProfile);
router.post("/profiles/:id/request-changes", requestProfileChanges);
router.post("/profiles/:id/unpublish", unpublishProfile);

// Platform Data
router.put("/platform-data/:id", updatePlatformData);

// Admin Users Management (Name, Email, Password, Role: Admin)
router.get("/users", getAdminUsers);
router.post("/users", addAdminUser);
router.delete("/users/:id", deleteAdminUser);

// Audit Trail
router.get("/audit-logs", getAuditLogs);

export default router;
