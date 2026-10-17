import { Router } from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { messageLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/', protect, getMessages);
router.post('/', messageLimiter, createMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
