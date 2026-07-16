import { Router } from 'express';
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import crewRoutes from './crewRoutes.js';
import allianceRoutes from './allianceRoutes.js';
import statusRoutes from './statusRoutes.js';
import messageRoutes from './messageRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

// Mount all routers
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/crew', crewRoutes);
router.use('/alliances', allianceRoutes);
router.use('/status-settings', statusRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

export default router;
