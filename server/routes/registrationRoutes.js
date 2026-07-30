import { Router } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationStats,
    deleteRegistration
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public route: submit event registration
router.post('/', createRegistration);

// Admin routes: view & manage registrations
router.get('/', protect, getAllRegistrations);
router.get('/stats', protect, getRegistrationStats);
router.delete('/:id', protect, deleteRegistration);

export default router;
