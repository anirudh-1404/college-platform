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

// Student Lead / Counseling Request Capture
router.post("/counseling", createPublicInquiry);
router.post("/inquiries", createPublicInquiry);

export default router;
