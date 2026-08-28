import express from "express";
import {
  getPublicColleges,
  getPublicCollegeDetail,
  getPublicCourses,
} from "../controllers/publicController.js";

const router = express.Router();

// Publicly Accessible Endpoints (No Auth Needed)
router.get("/colleges", getPublicColleges);
router.get("/colleges/:id", getPublicCollegeDetail);
router.get("/courses", getPublicCourses);

export default router;
