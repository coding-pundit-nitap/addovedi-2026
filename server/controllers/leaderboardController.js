import Registration from '../models/Registration.js';
import GlobalUser from '../models/GlobalUser.js';
import { getEventXpMapSafe, xpForTitle, levelForXp, onXpInvalidate, XP_TEAM_EVENT, XP_SINGLE_EVENT } from '../services/xpService.js';

// XP rule: see services/xpService.js (200 XP per verified registration, 250 XP when the event allows only one player; a level every
// 600 XP). Cancelled, unverified and declined/pending entries earn nothing.
const LIST_SIZE = 20;
const CACHE_MS = 20 * 1000;

// Alphabetical order for ties compares only the LETTERS of a name (case, accents, digits and symbols ignored), so a name like
// "!!Aaron" or "1abc" cannot jump the queue. A name with no letters at all sorts after everyone else.
const collator = new Intl.Collator('en', { sensitivity: 'base' });
const sortKey = (name) => String(name || '').normalize('NFKD').replace(/[^\p{L} ]/gu, '').replace(/\s+/g, ' ').trim();
const byName = (a, b) => {
    const ka = sortKey(a), kb = sortKey(b);
    if (!ka !== !kb) return ka ? -1 : 1;
    return collator.compare(ka, kb);
};
// Display name only: no HTML is ever built from it, but strip control characters and cap the length anyway.
const cleanName = (name) => String(name || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40) || 'Player';

let cached = { at: 0, data: null, pending: null };
onXpInvalidate(() => { cached = { at: 0, data: null, pending: null }; });

// One pass over the verified registrations; the result is shared for a few seconds so many players opening the
// leaderboard at once cost one database read, not one each.
async function computeRanking() {
    const counts = await Registration.aggregate([
        { $match: { status: 'VERIFIED' } },
        // Per registration: the leader plus every accepted teammate, upper-cased and de-duplicated ($setUnion), so a player can
        // never earn two XP awards from one registration. Tolerates damaged documents (members missing / not a list, entries that
        // are not objects, non-string ids) instead of failing the whole leaderboard.
        { $project: { _id: 0, ev: '$eventTitle', uids: { $setUnion: [{ $map: {
            input: { $concatArrays: [
                ['$leaderUID'],
                { $map: {
                    input: { $filter: { input: { $cond: [{ $isArray: '$members' }, '$members', []] }, as: 'm', cond: { $eq: [{ $ifNull: ['$$m.status', 'ACCEPTED'] }, 'ACCEPTED'] } } },
                    as: 'm', in: '$$m.uid'
                } }
            ] },
            as: 'u',
            in: { $cond: [{ $eq: [{ $type: '$$u' }, 'string'] }, { $toUpper: '$$u' }, null] }
        } }] } } },
        { $unwind: '$uids' },
        { $match: { uids: { $type: 'string', $ne: '' } } },
        { $group: { _id: { u: '$uids', ev: '$ev' }, n: { $sum: 1 } } }
    ]);
    const xpMap = await getEventXpMapSafe();
    // total XP per player = sum over their verified registrations of that event's award
    const perPlayer = new Map();
    for (const c of counts) { const k = c._id.u; const cur = perPlayer.get(k) || { xp: 0, n: 0 }; cur.xp += c.n * xpForTitle(xpMap, c._id.ev); cur.n += c.n; perPlayer.set(k, cur); }
    const ids = [...perPlayer.keys()];
    const users = ids.length
        ? await GlobalUser.find({ addovediId: { $in: ids } }).collation({ locale: 'en', strength: 2 }).select('addovediId name').lean()
        : [];
    const nameOf = new Map(users.map(u => [String(u.addovediId).toUpperCase(), cleanName(u.name)]));
    const rows = ids
        .filter(id => nameOf.has(id))
        .map(id => ({ id, name: nameOf.get(id), xp: perPlayer.get(id).xp, n: perPlayer.get(id).n }))
        .sort((a, b) => b.xp - a.xp || byName(a.name, b.name) || (a.id < b.id ? -1 : 1));
    // Players with equal XP are ordered alphabetically by name, so every player has a distinct rank (1, 2, 3, ...) and the
    // top 3 are always three specific players. Only the letters of the names are compared (see sortKey).
    rows.forEach((r, i) => { r.rank = i + 1; });
    return rows;
}

async function getRanking() {
    if (cached.data && Date.now() - cached.at < CACHE_MS) return cached.data;
    if (!cached.pending) {
        cached.pending = computeRanking()
            .then((rows) => { cached = { at: Date.now(), data: rows, pending: null }; return rows; })
            .catch((err) => { cached.pending = null; throw err; });
    }
    return cached.pending;
}

// GET /api/leaderboard (logged-in players only). Returns the top players plus the caller's own standing.
// Only display names, levels and XP leave the server: no emails, phone numbers or Addovedi IDs.
export const getLeaderboard = async (req, res) => {
    try {
        const rows = await getRanking();
        const mine = rows.find(r => r.id === String(req.participantAddovediId || '').toUpperCase());
        res.set('Cache-Control', 'no-store');
        return res.json({
            xpPerRegistration: XP_TEAM_EVENT,          // kept for older screens
            xpTeamEvent: XP_TEAM_EVENT,
            xpSingleEvent: XP_SINGLE_EVENT,
            totalPlayers: rows.length,
            top: rows.slice(0, LIST_SIZE).map(r => ({ rank: r.rank, name: r.name, level: levelForXp(r.xp), xp: r.xp, isMe: mine ? r.id === mine.id : false })),
            me: { rank: mine ? mine.rank : null, level: levelForXp(mine ? mine.xp : 0), xp: mine ? mine.xp : 0, verifiedRegistrations: mine ? mine.n : 0 }
        });
    } catch (err) {
        return res.status(500).json({ message: 'Could not load the leaderboard. Please try again.' });
    }
};
