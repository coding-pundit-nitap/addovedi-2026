import { Router } from 'express';
import { signup, login, updateProfile, checkUid, listPlayers, deletePlayer } from '../controllers/globalUserController.js';
import { participantAuthLimiter, lookupLimiter } from '../middleware/rateLimiters.js';
import { requireParticipant, protect } from '../middleware/auth.js';

const router = Router();

// Public participant account routes (separate from admin auth entirely).
router.post('/signup', participantAuthLimiter, signup);
router.post('/login', participantAuthLimiter, login);
router.put('/profile/:id', lookupLimiter, requireParticipant, updateProfile);
router.get('/check-uid/:addovediId', lookupLimiter, checkUid);


// Admin only: see every registered player and remove accounts.
router.get('/', protect, listPlayers);
router.delete('/:id', protect, deletePlayer);

export default router;
