import { Router } from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getMessages);
router.post('/', createMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
