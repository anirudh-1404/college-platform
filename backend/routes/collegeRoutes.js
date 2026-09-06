import express from "express";
import {
  getMyCollegeProfile,
  updateCollegeProfile,
  submitForApproval,
  getCollegeLeads,
} from "../controllers/collegeController.js";
import { verifyToken, isCollegeAdmin } from "../utils/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, isCollegeAdmin);

router.get("/profile", getMyCollegeProfile);
router.put("/profile", updateCollegeProfile);
router.post("/submit-review", submitForApproval);
router.post("/submit-approval", submitForApproval);
router.get("/leads", getCollegeLeads);

export default router;
