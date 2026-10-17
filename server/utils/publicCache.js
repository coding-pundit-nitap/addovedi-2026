// Tiny in-memory cache for the public GET endpoints that every visitor's browser polls every few
// seconds (events, crew, alliances, settings). Without it each poll is a MongoDB query, so request
// volume maps 1:1 to DB load; with it the DB sees at most one query per path per TTL.
// A successful admin write to a cached area clears the whole cache, so edits show up immediately; during a DB outage stale copies are served.
import mongoose from 'mongoose';

const TTL_MS = 10000;
const MAX_ENTRIES = 200;
const store = new Map();

export const publicCache = (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl;
    const hit = store.get(key);
    // Fresh copy, or ANY copy while the database is disconnected (stale beats an error page during an outage).
    if (hit && (Date.now() - hit.at < TTL_MS || mongoose.connection.readyState !== 1)) {
        return res.status(hit.status).json(hit.body);
    }
    const json = res.json.bind(res);
    res.json = (body) => {
        // Database down (the handler answered 5xx): serve the last good copy, however old, instead of an error page.
        if (res.statusCode >= 500 && hit) {
            res.status(200);
            return json(hit.body);
        }
        if (res.statusCode === 200) {
            // Bound memory: attacker-varied query strings can't grow the map without limit.
            if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
            store.set(key, { at: Date.now(), status: 200, body });
        }
        return json(body);
    };
    next();
};

// Only a SUCCESSFUL write to something the cache actually serves clears it. Clearing on every non-GET (the old behaviour)
// let anyone keep the cache permanently empty by spamming failed logins, pushing every poll back onto the database.
const CACHED_AREAS = /^\/api\/(events|crew|alliances|status-settings|settings)(\/|$)/;
export const invalidatePublicCache = (req, res, next) => {
    if (req.method !== 'GET') {
        res.on('finish', () => {
            if (res.statusCode < 400 && CACHED_AREAS.test(req.originalUrl.split('?')[0])) store.clear();
        });
    }
    next();
};
