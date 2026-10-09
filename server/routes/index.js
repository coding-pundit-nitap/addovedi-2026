import { Router } from 'express';
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import crewRoutes from './crewRoutes.js';
import allianceRoutes from './allianceRoutes.js';
import statusRoutes from './statusRoutes.js';
import messageRoutes from './messageRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import registrationRoutes from './registrationRoutes.js';
import auditRoutes from './auditRoutes.js';
import globalUserRoutes from './globalUserRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = Router();

// Mount all routers
router.use('/auth', authRoutes);
router.use('/participants', globalUserRoutes);
router.use('/events', eventRoutes);
router.use('/crew', crewRoutes);
router.use('/alliances', allianceRoutes);
router.use('/status-settings', statusRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);
router.use('/registrations', registrationRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/settings', settingsRoutes);

export default router;
