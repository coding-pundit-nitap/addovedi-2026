import { Router } from 'express';
import { login, verify, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter, adminAccountLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/login', loginLimiter, adminAccountLimiter, login);
router.get('/verify', protect, verify);
router.post('/change-password', protect, loginLimiter, changePassword);

export default router;
