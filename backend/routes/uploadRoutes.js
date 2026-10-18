import express from "express";
import multer from "multer";
import { uploadImage, proxyImage, uploadFromUrl } from "../controllers/uploadController.js";

const router = express.Router();

// Configure Multer with memory storage and 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// GET /api/upload/proxy?url=... - Image proxy to bypass CORS for client-side canvas cropping
router.get("/proxy", proxyImage);

// POST /api/upload/url - Direct upload from remote URL to Cloudinary
router.post("/url", uploadFromUrl);

// POST /api/upload - Single image upload from device
router.post("/", upload.single("image"), uploadImage);

export default router;

