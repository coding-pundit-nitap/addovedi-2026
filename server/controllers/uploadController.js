import cloudinary from '../config/cloudinary.js';
import { compressImage } from '../utils/imageCompress.js';

/**
 * Handles binary image buffer parsing and streams it straight to Cloudinary servers.
 */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Check environment setup
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            return res.status(400).json({ 
                message: 'Cloudinary credentials are not configured in the server environment (.env).' 
            });
        }

        // Shrink before storing (and before it travels to Cloudinary). Also proves the bytes really are an image.
        let img;
        try {
            img = await compressImage(req.file.buffer, req.file.mimetype);
        } catch (e) {
            return res.status(400).json({ message: 'That file could not be read as an image. Please upload a JPG, PNG, WEBP or GIF.' });
        }

        // Initialize upload stream to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'addovedi_techfest', ...(img.format ? { format: img.format } : {}) },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: `Cloudinary error: ${error.message}` });
                }
                return res.json({ url: result.secure_url, bytesBefore: img.before, bytesAfter: img.after });
            }
        );

        uploadStream.end(img.buffer);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
