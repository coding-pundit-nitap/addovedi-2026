import { Router } from 'express';
import { getStatus, updateStatus } from '../controllers/statusController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getStatus);
router.put('/', protect, updateStatus);

export default router;
