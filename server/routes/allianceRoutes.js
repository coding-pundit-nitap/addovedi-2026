import { Router } from 'express';
import {
    getAlliances,
    createAlliance,
    updateAlliance,
    deleteAlliance,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/allianceController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', protect, createCategory);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

router.get('/', getAlliances);
router.post('/', protect, createAlliance);
router.put('/:id', protect, updateAlliance);
router.delete('/:id', protect, deleteAlliance);

export default router;
