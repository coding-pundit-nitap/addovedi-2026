import { Router } from 'express';
import { signup, login, updateProfile, checkUid } from '../controllers/globalUserController.js';
import { participantAuthLimiter, lookupLimiter } from '../middleware/rateLimiters.js';
import { requireParticipant } from '../middleware/auth.js';

const router = Router();

// Public participant account routes (separate from admin auth entirely).
router.post('/signup', participantAuthLimiter, signup);
router.post('/login', participantAuthLimiter, login);
router.put('/profile/:id', lookupLimiter, requireParticipant, updateProfile);
router.get('/check-uid/:addovediId', lookupLimiter, checkUid);

export default router;
