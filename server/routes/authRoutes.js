import { Router } from 'express';
import { login, verify, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/verify', protect, verify);
router.post('/change-password', protect, changePassword);

export default router;
