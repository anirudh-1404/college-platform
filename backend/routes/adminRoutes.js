import express from "express";
import {
  getAdminAnalytics,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
  getAllProfiles,
  getProfileById,
  updateCollegeByAdmin,
  approveAndPublishProfile,
  requestProfileChanges,
  unpublishProfile,
  updatePlatformData,
  getAdminUsers,
  addAdminUser,
  deleteAdminUser,
  getAuditLogs,
  getAdminCareerGuides,
  createAdminCareerGuide,
  updateAdminCareerGuide,
  deleteAdminCareerGuide,
  getAdminExams,
  createAdminExam,
  updateAdminExam,
  deleteAdminExam,
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getAdminLiveIntel,
  createAdminLiveIntel,
  updateAdminLiveIntel,
  deleteAdminLiveIntel,
  toggleAdminLiveIntel,
  getAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
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
router.get("/profiles/:id", getProfileById);
router.put("/profiles/:id", updateCollegeByAdmin);
router.post("/profiles/:id/publish", approveAndPublishProfile);
router.post("/profiles/:id/request-changes", requestProfileChanges);
router.post("/profiles/:id/unpublish", unpublishProfile);

// Platform Data
router.put("/platform-data/:id", updatePlatformData);

// Admin Users Management (Name, Email, Password, Role: Admin)
router.get("/users", getAdminUsers);
router.post("/users", addAdminUser);
router.delete("/users/:id", deleteAdminUser);

// Career Guides / Roadmaps Management
router.get("/career-guides", getAdminCareerGuides);
router.post("/career-guides", createAdminCareerGuide);
router.put("/career-guides/:id", updateAdminCareerGuide);
router.delete("/career-guides/:id", deleteAdminCareerGuide);

// Entrance Exams Management
router.get("/exams", getAdminExams);
router.post("/exams", createAdminExam);
router.put("/exams/:id", updateAdminExam);
router.delete("/exams/:id", deleteAdminExam);

// Audit Trail
router.get("/audit-logs", getAuditLogs);

// Contact Inquiries / Student Leads Management
router.get("/inquiries", getAdminInquiries);
router.patch("/inquiries/:id/status", updateInquiryStatus);
router.delete("/inquiries/:id", deleteInquiry);

// Live Intel Ticker CRUD
router.get("/live-intel", getAdminLiveIntel);
router.post("/live-intel", createAdminLiveIntel);
router.put("/live-intel/:id", updateAdminLiveIntel);
router.delete("/live-intel/:id", deleteAdminLiveIntel);
router.patch("/live-intel/:id/toggle", toggleAdminLiveIntel);

// Blogs / Articles CMS CRUD
router.get("/blogs", getAdminBlogs);
router.post("/blogs", createAdminBlog);
router.put("/blogs/:id", updateAdminBlog);
router.delete("/blogs/:id", deleteAdminBlog);

export default router;
