import { Router } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationStats,
    deleteRegistration,
    cancelRegistration,
    updateRegistrationStatus,
    getMyRegistrations,
    respondToTeamInvite,
    inviteMember,
    uninviteMember,
    continueSmallerTeam
} from '../controllers/registrationController.js';
import { protect, requireParticipant } from '../middleware/auth.js';
import { registrationLimiter, participantActionLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// Public routes: submit / cancel event registration
router.post('/', requireParticipant, registrationLimiter, createRegistration);
router.post('/cancel', requireParticipant, registrationLimiter, cancelRegistration);
router.post('/respond', requireParticipant, registrationLimiter, respondToTeamInvite);
router.post('/invite', requireParticipant, registrationLimiter, inviteMember);
router.post('/uninvite', requireParticipant, registrationLimiter, uninviteMember);
router.post('/finalize', requireParticipant, registrationLimiter, continueSmallerTeam);
router.get('/my/:addovediId', requireParticipant, participantActionLimiter, getMyRegistrations);

// Admin routes: view & manage registrations
router.get('/', protect, getAllRegistrations);
router.get('/stats', protect, getRegistrationStats);
router.patch('/:id', protect, updateRegistrationStatus);
router.delete('/:id', protect, deleteRegistration);

export default router;
