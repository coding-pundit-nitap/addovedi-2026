import rateLimit from 'express-rate-limit';

// Narrow guard against brute-force / credential stuffing on the single admin account.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
});

// Separate from loginLimiter (admin) so hammering participant signup/login
// can never also lock out admin login attempts from the same IP — each
// rateLimit() instance keeps its own independent counter store.
export const participantAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' }
});

// Prevents spamming fake event registrations / cancellations.
export const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});

// Narrow guard on the public contact/query form — unlike signup/login/
// registration it has no CAPTCHA, so without its own tight ceiling a script
// could flood the admin inbox with spam messages all day within the much
// more generous shared apiLimiter.
export const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages sent. Please try again later.' }
});

// Addovedi IDs are sequential (ADV26-0001, ADV26-0002, ...), so the public
// lookup-by-id routes are otherwise walkable end-to-end under the shared
// apiLimiter alone. This keeps scripted enumeration slow enough to be
// impractical without affecting a real visitor checking their own status.
export const lookupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});

// Baseline limiter for all other API traffic. Sized generously because the
// public site polls GET /api/events, /api/crew and /api/alliances every few
// seconds (see client polling intervals) so admin-portal edits show up
// without a manual reload — a single visitor browsing a few pages can
// legitimately generate a few hundred GETs in a 15 minute window.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});
