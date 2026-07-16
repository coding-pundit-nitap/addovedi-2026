import { Router } from 'express';
import {
    getAlliances,
    createAlliance,
    updateAlliance,
    deleteAlliance
} from '../controllers/allianceController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getAlliances);
router.post('/', protect, createAlliance);
router.put('/:id', protect, updateAlliance);
router.delete('/:id', protect, deleteAlliance);

export default router;
