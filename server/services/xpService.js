import SubEvent from '../models/SubEvent.js';

// XP rule (keep in step with client/src/utils/xp.js):
//   - A player earns XP for every VERIFIED registration they are part of, as the team leader or as an accepted teammate.
//   - 250 XP when the event allows only ONE player (the event's maxTeam is 1); 200 XP for every other event, whatever size
//     the team actually registered with (a lone player in a team event still earns 200).
//   - It follows the event's CURRENT team-size setting and the CURRENT registrations, so editing an event or a registration
//     in the admin portal changes XP straight away. Nothing is stored on the registration.
//   - Every 600 XP is one level, from level 1 up to level 10.
export const XP_TEAM_EVENT = 200;
export const XP_SINGLE_EVENT = 250;
export const XP_PER_LEVEL = 600;
export const MAX_LEVEL = 10;

const TTL_MS = 20 * 1000;
const norm = (t) => String(t == null ? '' : t).trim().toUpperCase();

let cache = { at: 0, map: null, pending: null };
const invalidators = [];

// event title (upper-case) -> XP per verified registration. Titles come from the database, never from a request.
async function loadMap() {
    const subs = await SubEvent.find({}).select('title maxTeam').lean();
    const map = new Map();
    for (const s of subs) map.set(norm(s.title), Number(s.maxTeam) === 1 ? XP_SINGLE_EVENT : XP_TEAM_EVENT);
    return map;
}

export async function getEventXpMap() {
    if (cache.map && Date.now() - cache.at < TTL_MS) return cache.map;
    if (!cache.pending) {
        cache.pending = loadMap()
            .then((map) => { cache = { at: Date.now(), map, pending: null }; return map; })
            .catch((err) => { cache.pending = null; throw err; });
    }
    return cache.pending;
}

// Never throws: if the event list cannot be read, everything is treated as a team event (200), so a database hiccup can never
// break "my registrations" or the leaderboard.
export async function getEventXpMapSafe() {
    try { return await getEventXpMap(); } catch { return new Map(); }
}

// An event that is no longer in the list (renamed or deleted) counts as a team event.
export const xpForTitle = (map, title) => (map && map.get(norm(title))) || XP_TEAM_EVENT;
export const levelForXp = (xp) => Math.min(MAX_LEVEL, 1 + Math.floor(Math.max(0, Number(xp) || 0) / XP_PER_LEVEL));

// Call after any admin change that can move XP (event team size, registration status / members / leader / delete).
export const onXpInvalidate = (fn) => { invalidators.push(fn); };
export const invalidateXpCaches = () => {
    cache = { at: 0, map: null, pending: null };
    for (const fn of invalidators) { try { fn(); } catch { /* never let a cache refresh break a request */ } }
};
