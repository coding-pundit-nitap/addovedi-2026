import cloudinary from '../config/cloudinary.js';

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

        // Initialize upload stream to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'addovedi_techfest' },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: `Cloudinary error: ${error.message}` });
                }
                return res.json({ url: result.secure_url });
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
