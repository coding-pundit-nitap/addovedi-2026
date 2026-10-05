import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// SVG is deliberately excluded: it can embed <script> and is a stored-XSS vector
// if ever rendered inline.
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP, GIF and SVG images are allowed.'));
        }
        cb(null, true);
    }
});

// Expose protected upload router mapping
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
