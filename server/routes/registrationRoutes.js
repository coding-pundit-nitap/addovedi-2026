import { Router } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationStats,
    deleteRegistration,
    cancelRegistration,
    updateRegistrationStatus,
    getMyRegistrations
} from '../controllers/registrationController.js';
import { protect, requireParticipant } from '../middleware/auth.js';
import { registrationLimiter, lookupLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// Public routes: submit / cancel event registration
router.post('/', registrationLimiter, requireParticipant, createRegistration);
router.post('/cancel', registrationLimiter, requireParticipant, cancelRegistration);
router.get('/my/:addovediId', lookupLimiter, getMyRegistrations);

// Admin routes: view & manage registrations
router.get('/', protect, getAllRegistrations);
router.get('/stats', protect, getRegistrationStats);
router.patch('/:id', protect, updateRegistrationStatus);
router.delete('/:id', protect, deleteRegistration);

export default router;
