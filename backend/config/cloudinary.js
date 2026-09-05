import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

const ensureCloudinaryConfig = () => {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return true;
  }
  return false;
};

// Initial config attempt
ensureCloudinaryConfig();

/**
 * Upload a file buffer to Cloudinary with fallback
 * @param {Buffer} fileBuffer
 * @param {Object} options
 * @returns {Promise<{url: string, public_id: string, isMock?: boolean}>}
 */
export const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    ensureCloudinaryConfig();
    if (!isCloudinaryConfigured()) {
      // Fallback: Return a base64 Data URI if Cloudinary credentials are not yet configured in .env
      console.warn(
        "⚠️ Cloudinary credentials missing in .env. Returning data URI fallback."
      );
      const mimeType = options.mimeType || "image/jpeg";
      const base64Data = fileBuffer.toString("base64");
      return resolve({
        url: `data:${mimeType};base64,${base64Data}`,
        public_id: `fallback_${Date.now()}`,
        isMock: true,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "vidyascope",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export { cloudinary };
