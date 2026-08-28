import express from "express";
import {
  getPublicColleges,
  getPublicCollegeDetail,
  getPublicCourses,
  getPublicCareerGuides,
  getPublicCareerGuideDetail,
} from "../controllers/publicController.js";

const router = express.Router();

// Publicly Accessible Endpoints (No Auth Needed)
router.get("/colleges", getPublicColleges);
router.get("/colleges/:id", getPublicCollegeDetail);
router.get("/courses", getPublicCourses);
router.get("/career-guides", getPublicCareerGuides);
router.get("/career-guides/:slugOrId", getPublicCareerGuideDetail);

export default router;
