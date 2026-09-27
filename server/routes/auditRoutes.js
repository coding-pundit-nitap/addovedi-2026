import { Router } from 'express';
import { getAuditLogs, clearAuditLogs } from '../controllers/auditController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getAuditLogs);
router.delete('/', protect, clearAuditLogs);

export default router;
