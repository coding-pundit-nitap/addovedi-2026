import { Router } from 'express';
import { signup, login, updateProfile, checkUid, listPlayers, deletePlayer, changePassword, resetPassword } from '../controllers/globalUserController.js';
import { participantLoginLimiter, participantSignupLimiter, participantAccountLimiter, lookupLimiter } from '../middleware/rateLimiters.js';
import { requireParticipant, protect } from '../middleware/auth.js';

const router = Router();

// Public participant account routes (separate from admin auth entirely).
router.post('/signup', participantSignupLimiter, signup);
router.post('/login', participantLoginLimiter, participantAccountLimiter, login);
router.put('/profile/:id', lookupLimiter, requireParticipant, updateProfile);
router.post('/change-password', participantLoginLimiter, requireParticipant, changePassword);
router.post('/:id/reset-password', protect, resetPassword);
router.get('/check-uid/:addovediId', lookupLimiter, checkUid);


// Admin only: see every registered player and remove accounts.
router.get('/', protect, listPlayers);
router.delete('/:id', protect, deletePlayer);

export default router;
