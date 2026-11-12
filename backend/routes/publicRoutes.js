import express from "express";
import {
  getPublicColleges,
  getPublicCollegeDetail,
  getPublicCourses,
  getPublicCareerGuides,
  getPublicCareerGuideDetail,
  getPublicExams,
  getPublicExamDetail,
  createPublicInquiry,
  getPublicLiveIntel,
  getPublicBlogs,
  getPublicBlogDetail,
  trackPublicView,
} from "../controllers/publicController.js";

const router = express.Router();

// Publicly Accessible Endpoints (No Auth Needed)
router.get("/colleges", getPublicColleges);
router.get("/colleges/:id", getPublicCollegeDetail);
router.get("/courses", getPublicCourses);
router.get("/career-guides", getPublicCareerGuides);
router.get("/career-guides/:slugOrId", getPublicCareerGuideDetail);
router.get("/exams", getPublicExams);
router.get("/exams/:slugOrId", getPublicExamDetail);
router.get("/live-intel", getPublicLiveIntel);
router.get("/blogs", getPublicBlogs);
router.get("/blogs/:slugOrId", getPublicBlogDetail);

// Student Lead / Counseling Request Capture
router.post("/counseling", createPublicInquiry);
router.post("/inquiries", createPublicInquiry);

// Public Traffic & Page View Tracking
router.post("/track-view", trackPublicView);

export default router;
