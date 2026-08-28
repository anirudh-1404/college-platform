import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "vidyascope_super_secret_jwt_key_2026_production",
    { expiresIn: "7d" }
  );

  res.cookie("vidyascope_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies?.vidyascope_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "vidyascope_super_secret_jwt_key_2026_production"
    );

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "super_admin")) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
};

export const isCollegeAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "college_admin" || req.user.role === "admin" || req.user.role === "super_admin")) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Forbidden: College Administrator access required" });
};
