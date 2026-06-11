import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

class UploadService {
  uploadImage(fileBuffer, folder = process.env.CLOUDINARY_FOLDER || "impeccable-unisex-salon") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 900, crop: "fill", gravity: "auto" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) return reject(error);

          return resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}

export const uploadService = new UploadService();