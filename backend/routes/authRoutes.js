import express from "express";
import {
  registerCollege,
  verifyRegisterOtp,
  registerAdmin,
  login,
  verifyLoginOtp,
  resendOtp,
  getMe,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register-college", registerCollege);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

export default router;
