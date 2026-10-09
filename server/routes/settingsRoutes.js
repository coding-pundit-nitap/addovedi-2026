import { Router } from 'express';
import { getSettings, setRegistrationOpen, setCrewVisible } from '../services/settingsService.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: the site needs to know whether to show the registration form or "starting soon".
router.get('/registration', async (req, res) => {
    try {
        const s = await getSettings();
        return res.json({ registrationOpen: s.registrationOpen === true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Admin only: open or close event registration.
router.put('/registration', protect, async (req, res) => {
    try {
        if (typeof req.body?.registrationOpen !== 'boolean') {
            return res.status(400).json({ message: 'registrationOpen must be true or false.' });
        }
        const s = await setRegistrationOpen(req.body.registrationOpen);
        await recordAuditLog(req, { action: s.registrationOpen ? 'OPEN_REGISTRATION' : 'CLOSE_REGISTRATION', details: {} });
        return res.json({ registrationOpen: s.registrationOpen });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Public: whether the Crew page is live yet.
router.get('/crew', async (req, res) => {
    try {
        const s = await getSettings();
        return res.json({ crewVisible: s.crewVisible === true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Admin only: show or hide the Crew page ("launching soon" when hidden).
router.put('/crew', protect, async (req, res) => {
    try {
        if (typeof req.body?.crewVisible !== 'boolean') {
            return res.status(400).json({ message: 'crewVisible must be true or false.' });
        }
        const s = await setCrewVisible(req.body.crewVisible);
        await recordAuditLog(req, { action: s.crewVisible ? 'SHOW_CREW_PAGE' : 'HIDE_CREW_PAGE', details: {} });
        return res.json({ crewVisible: s.crewVisible });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;
