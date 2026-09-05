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
