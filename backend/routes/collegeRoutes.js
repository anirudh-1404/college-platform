import express from "express";
import {
  getMyCollegeProfile,
  updateCollegeProfile,
  submitForApproval,
} from "../controllers/collegeController.js";
import { verifyToken, isCollegeAdmin } from "../utils/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, isCollegeAdmin);

router.get("/profile", getMyCollegeProfile);
router.put("/profile", updateCollegeProfile);
router.post("/submit-review", submitForApproval);

export default router;
