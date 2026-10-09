// Tiny in-memory cache for the public GET endpoints that every visitor's browser polls every few
// seconds (events, crew, alliances, settings). Without it each poll is a MongoDB query, so request
// volume maps 1:1 to DB load; with it the DB sees at most one query per path per TTL.
// Any non-GET request to the API clears the whole cache, so admin edits show up immediately.
const TTL_MS = 3000;
const MAX_ENTRIES = 200;
const store = new Map();

export const publicCache = (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl;
    const hit = store.get(key);
    if (hit && Date.now() - hit.at < TTL_MS) {
        return res.status(hit.status).json(hit.body);
    }
    const json = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode === 200) {
            // Bound memory: attacker-varied query strings can't grow the map without limit.
            if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
            store.set(key, { at: Date.now(), status: 200, body });
        }
        return json(body);
    };
    next();
};

export const invalidatePublicCache = (req, res, next) => {
    if (req.method !== 'GET') res.on('finish', () => store.clear());
    next();
};
