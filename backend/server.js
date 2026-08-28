import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".onrender.com") || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for smooth local dev / postman
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Database Connection
connectdb();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "VidyaScope Platform API is active and healthy.",
  });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to VidyaScope Unified REST API Server",
    docs: "/api/public/colleges",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VidyaScope API Server running on port ${PORT}`);
});