import { Router } from 'express';
import { signup, login, updateProfile, checkUid, listPlayers, deletePlayer, changePassword, resetPassword } from '../controllers/globalUserController.js';
import { participantLoginLimiter, participantSignupLimiter, participantAccountLimiter, participantActionLimiter } from '../middleware/rateLimiters.js';
import { requireParticipant, requireParticipantAllowTemp, protect } from '../middleware/auth.js';

const router = Router();

// Public participant account routes (separate from admin auth entirely).
router.post('/signup', participantSignupLimiter, signup);
router.post('/login', participantLoginLimiter, participantAccountLimiter, login);
router.put('/profile/:id', requireParticipant, participantActionLimiter, updateProfile);
router.post('/change-password', participantLoginLimiter, requireParticipantAllowTemp, changePassword);
router.post('/:id/reset-password', protect, resetPassword);
// Login required (and counted per account): this used to be an anonymous endpoint anyone could walk to list every Addovedi ID and name.
router.get('/check-uid/:addovediId', requireParticipant, participantActionLimiter, checkUid);


// Admin only: see every registered player and remove accounts.
router.get('/', protect, listPlayers);
router.delete('/:id', protect, deletePlayer);

export default router;
