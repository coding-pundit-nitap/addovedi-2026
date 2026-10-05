import { Router } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationStats,
    deleteRegistration,
    cancelRegistration,
    updateRegistrationStatus
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';
import { registrationLimiter } from '../middleware/rateLimiters.js';

const router = Router();

// Public routes: submit / cancel event registration
router.post('/', registrationLimiter, createRegistration);
router.post('/cancel', registrationLimiter, cancelRegistration);

// Admin routes: view & manage registrations
router.get('/', protect, getAllRegistrations);
router.get('/stats', protect, getRegistrationStats);
router.patch('/:id', protect, updateRegistrationStatus);
router.delete('/:id', protect, deleteRegistration);

export default router;
