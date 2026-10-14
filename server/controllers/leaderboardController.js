import Registration from '../models/Registration.js';
import GlobalUser from '../models/GlobalUser.js';

// XP rule (keep in step with client/src/utils/xp.js): a player earns 200 XP for every VERIFIED registration they are part of,
// as the team leader or as an accepted teammate. XP appears the moment the admin verifies the registration. Every 3 verified
// registrations is one level, from level 1 up to level 10. Cancelled, unverified and declined/pending entries earn nothing.
const XP_PER_REGISTRATION = 200;
const REGISTRATIONS_PER_LEVEL = 3;
const MAX_LEVEL = 10;
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
const levelFor = (count) => Math.min(MAX_LEVEL, 1 + Math.floor(count / REGISTRATIONS_PER_LEVEL));
// Display name only: no HTML is ever built from it, but strip control characters and cap the length anyway.
const cleanName = (name) => String(name || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40) || 'Player';

let cached = { at: 0, data: null, pending: null };

// One pass over the verified registrations; the result is shared for a few seconds so many players opening the
// leaderboard at once cost one database read, not one each.
async function computeRanking() {
    const counts = await Registration.aggregate([
        { $match: { status: 'VERIFIED' } },
        { $project: { _id: 0, uids: { $concatArrays: [
            ['$leaderUID'],
            { $map: {
                input: { $filter: { input: { $ifNull: ['$members', []] }, as: 'm', cond: { $eq: [{ $ifNull: ['$$m.status', 'ACCEPTED'] }, 'ACCEPTED'] } } },
                as: 'm', in: '$$m.uid'
            } }
        ] } } },
        { $unwind: '$uids' },
        { $match: { uids: { $type: 'string', $ne: '' } } },
        { $group: { _id: { $toUpper: '$uids' }, n: { $sum: 1 } } }
    ]);
    const ids = counts.map(c => c._id);
    const users = ids.length
        ? await GlobalUser.find({ addovediId: { $in: ids } }).collation({ locale: 'en', strength: 2 }).select('addovediId name').lean()
        : [];
    const nameOf = new Map(users.map(u => [String(u.addovediId).toUpperCase(), cleanName(u.name)]));
    const rows = counts
        .filter(c => nameOf.has(c._id))
        .map(c => ({ id: c._id, name: nameOf.get(c._id), n: c.n }))
        .sort((a, b) => b.n - a.n || byName(a.name, b.name) || (a.id < b.id ? -1 : 1));
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
            xpPerRegistration: XP_PER_REGISTRATION,
            totalPlayers: rows.length,
            top: rows.slice(0, LIST_SIZE).map(r => ({ rank: r.rank, name: r.name, level: levelFor(r.n), xp: r.n * XP_PER_REGISTRATION, isMe: mine ? r.id === mine.id : false })),
            me: { rank: mine ? mine.rank : null, level: levelFor(mine ? mine.n : 0), xp: (mine ? mine.n : 0) * XP_PER_REGISTRATION, verifiedRegistrations: mine ? mine.n : 0 }
        });
    } catch (err) {
        return res.status(500).json({ message: 'Could not load the leaderboard. Please try again.' });
    }
};
