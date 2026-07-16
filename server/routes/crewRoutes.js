import { Router } from 'express';
import { getCrew, createCrew, updateCrew, deleteCrew } from '../controllers/crewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getCrew);
router.post('/', protect, createCrew);
router.put('/:id', protect, updateCrew);
router.delete('/:id', protect, deleteCrew);

export default router;
