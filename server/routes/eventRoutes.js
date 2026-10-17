import { Router } from 'express';
import {
    getEvents,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubEvent,
    updateSubEvent,
    deleteSubEvent,
    setSubEventRegistration
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getEvents);

// Categories
router.post('/category', protect, createCategory);
router.put('/category/:id', protect, updateCategory);
router.delete('/category/:id', protect, deleteCategory);

// Sub-Events
router.post('/sub', protect, createSubEvent);
router.put('/sub/:id', protect, updateSubEvent);
router.patch('/sub/:id/registration', protect, setSubEventRegistration);
router.delete('/sub/:id', protect, deleteSubEvent);

export default router;
