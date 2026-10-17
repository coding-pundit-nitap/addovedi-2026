import express from 'express';
import { requireParticipant } from '../middleware/auth.js';
import { participantActionLimiter } from '../middleware/rateLimiters.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();
router.get('/', requireParticipant, participantActionLimiter, getLeaderboard);
export default router;
