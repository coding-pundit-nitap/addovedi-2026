import { Router } from 'express';
import { login, verify, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.get('/verify', protect, verify);
router.post('/change-password', loginLimiter, protect, changePassword);

export default router;
