import { uploadBufferToCloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided in request",
      });
    }

    const folder = req.body.folder || "vidyascope/colleges";
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder,
      mimeType: req.file.mimetype,
    });

    return res.status(200).json({
      success: true,
      message: uploadResult.isMock
        ? "Image processed (Cloudinary credentials pending in .env)"
        : "Image uploaded successfully to Cloudinary",
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      isConfigured: isCloudinaryConfigured(),
    });
  } catch (error) {
    console.error("uploadImage error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export const proxyImage = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send("URL parameter is required");
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch image");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400");

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("proxyImage error:", error);
    return res.status(500).send("Proxy error");
  }
};

export const uploadFromUrl = async (req, res) => {
  try {
    const { url, folder } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: "Could not download image from provided URL",
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    const uploadResult = await uploadBufferToCloudinary(buffer, {
      folder: folder || "vidyascope/colleges",
      mimeType,
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      isConfigured: isCloudinaryConfigured(),
    });
  } catch (error) {
    console.error("uploadFromUrl error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload from URL",
      error: error.message,
    });
  }
};

