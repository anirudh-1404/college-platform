import express from "express";
import {
  registerCollege,
  registerAdmin,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register-college", registerCollege);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;
