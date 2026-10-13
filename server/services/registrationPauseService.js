import Registration from '../models/Registration.js';
import SubEvent from '../models/SubEvent.js';
import { getSettings, registrationModeOf } from './settingsService.js';

// While registration is closed for an event (or the main switch is not OPEN), the 24-hour clock on pending teammate invites
// is paused, so an invitee can still accept / decline after it re-opens and the team carries on from where it left off.
// When registration opens again, pending invites get a fresh 24 hours. With nothing closed, nothing here changes behaviour.
let cache = null;
let cacheAt = 0;
const TTL_MS = 10 * 1000;

export const getPauseInfo = async (force = false) => {
    if (!force && cache && Date.now() - cacheAt < TTL_MS) return cache;
    const [settings, closed] = await Promise.all([getSettings(), SubEvent.find({ registrationClosed: true }).select('title').lean()]);
    cache = { mainOpen: registrationModeOf(settings) === 'open', closedTitles: closed.map(c => c.title) };
    cacheAt = Date.now();
    return cache;
};
export const invalidatePauseInfo = () => { cache = null; };

export const isEventPaused = (info, eventTitle) =>
    !info.mainOpen || info.closedTitles.some(t => String(t).toLowerCase() === String(eventTitle || '').toLowerCase());

// Start a fresh 24h window for every pending invite (of one event, or of all events that are open). Skipped while the main
// switch is not open (the pause is still in force). Returns how many registrations were touched.
export const restartPendingInviteClocks = async ({ eventTitle } = {}) => {
    invalidatePauseInfo();
    const info = await getPauseInfo(true);
    if (!info.mainOpen) return 0;
    const filter = { status: { $ne: 'CANCELLED' }, members: { $elemMatch: { status: 'PENDING' } } };
    if (eventTitle) {
        if (info.closedTitles.some(t => t.toLowerCase() === String(eventTitle).toLowerCase())) return 0;
        filter.eventTitle = eventTitle;
    } else if (info.closedTitles.length) {
        filter.eventTitle = { $nin: info.closedTitles };
    }
    const r = await Registration.updateMany(filter, { $set: { 'members.$[m].invitedAt': new Date() } }, { arrayFilters: [{ 'm.status': 'PENDING' }] });
    return r.modifiedCount || 0;
};
