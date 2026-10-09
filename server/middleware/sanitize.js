// Defence in depth against NoSQL operator injection ({"email": {"$ne": null}} etc.): drop any
// key starting with "$" or containing "." from the body, query string and URL params before a
// controller sees them. Controllers also type-check, but one forgotten check shouldn't be exploitable.
const clean = (value, depth = 0) => {
    if (depth > 8 || value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(v => clean(v, depth + 1));
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        if (k.startsWith('$') || k.includes('.')) continue;
        out[k] = clean(v, depth + 1);
    }
    return out;
};

export const sanitizeInput = (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) {
        const q = clean(req.query);
        // Express 5-style read-only query getters aside, Express 4 allows reassignment.
        Object.keys(req.query).forEach(k => { delete req.query[k]; });
        Object.assign(req.query, q);
    }
    if (req.params) req.params = clean(req.params);
    next();
};
