import { Router } from 'express';
import { getSettings, setRegistrationMode, registrationModeOf, setRegistrationOpen, setCrewVisible, setEventsVisible } from '../services/settingsService.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: the site needs to know whether to show the registration form or "starting soon".
router.get('/registration', async (req, res) => {
    try {
        const mode = registrationModeOf(await getSettings());
        return res.json({ registrationMode: mode, registrationOpen: mode === 'open' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Admin only: set registration to 'soon' (starting soon), 'open' or 'closed'.
router.put('/registration', protect, async (req, res) => {
    try {
        const mode = req.body?.registrationMode;
        if (!['soon', 'open', 'closed'].includes(mode)) {
            return res.status(400).json({ message: "registrationMode must be 'soon', 'open' or 'closed'." });
        }
        await setRegistrationMode(mode);
        await recordAuditLog(req, { action: `REGISTRATION_${mode.toUpperCase()}`, details: {} });
        return res.json({ registrationMode: mode, registrationOpen: mode === 'open' });
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

// Public: whether the Events/Arena section is live (otherwise visitors see "coming soon").
// Anything but an explicit false counts as live, so an older settings document keeps the site working.
router.get('/events', async (req, res) => {
    try {
        const s = await getSettings();
        return res.json({ eventsVisible: s.eventsVisible !== false });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Admin only: show the Events section, or replace it with a "coming soon" page.
router.put('/events', protect, async (req, res) => {
    try {
        if (typeof req.body?.eventsVisible !== 'boolean') {
            return res.status(400).json({ message: 'eventsVisible must be true or false.' });
        }
        const s = await setEventsVisible(req.body.eventsVisible);
        await recordAuditLog(req, { action: s.eventsVisible ? 'SHOW_EVENTS_SECTION' : 'HIDE_EVENTS_SECTION', details: {} });
        return res.json({ eventsVisible: s.eventsVisible !== false });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;
