import rateLimit from 'express-rate-limit';

// Narrow guard against brute-force / credential stuffing on the single admin account.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
});

// Separate from loginLimiter (admin) so hammering participant signup/login
// can never also lock out admin login attempts from the same IP — each
// rateLimit() instance keeps its own independent counter store.
// Participant login: only FAILED attempts count (a campus NAT shares one public IP among
// hundreds of students, so counting successes would lock real users out on launch day).
export const participantLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' }
});

// Signup already requires a Cloudflare Turnstile token, so the per-IP ceiling can be generous
// (many students sign up from the same college network).
export const participantSignupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 400,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' }
});

// Per-ACCOUNT failed-login cap, keyed on the email/username being guessed. The per-IP limiters
// can't stop a distributed guess against one account; this does, regardless of source IP.
const accountKey = (field) => (req) => {
    const v = req.body && req.body[field];
    return typeof v === 'string' ? `acct:${v.trim().toLowerCase().slice(0, 254)}` : 'acct:none';
};
export const participantAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    keyGenerator: accountKey('email'),
    validate: { keyGeneratorIpFallback: false },
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many failed attempts for this account. Please try again later.' }
});
export const adminAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    keyGenerator: accountKey('username'),
    validate: { keyGeneratorIpFallback: false },
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again later.' }
});

// Prevents spamming fake event registrations / cancellations.
// Registration now also requires a valid participant login, so abuse is already
// account-bound; this per-IP ceiling is kept roomy for shared college networks.
export const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    keyGenerator: (req) => `u:${req.participantAddovediId || 'anon'}`, // per player, not per IP (shared campus Wi-Fi); mount AFTER requireParticipant
    validate: { keyGeneratorIpFallback: false },
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
    limit: 30, // has a CAPTCHA now; this is per address, and a whole campus can share one
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

const POLLED_PATHS = /^\/(events|crew|alliances|alliances\/categories|status-settings|settings\/registration|settings\/crew|settings\/events|registrations\/my\/[^/]+)\/?$/;
const isPublicPoll = (req) => req.method === 'GET' && POLLED_PATHS.test(req.path);

// Backstop for the cached public polling endpoints: ~50 req/s per IP. Cheap to serve (cached),
// so this only stops raw floods, not a lecture hall of real visitors on one NAT.
export const publicReadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30000, // a whole campus can share one IP; polling cost is bounded by publicCache, not this
    skip: (req) => !isPublicPoll(req),
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});

// Limits a LOGGED-IN player's own requests (profile saves, ID checks, the registrations poll), counted per
// account instead of per IP address. Per-IP counters are wrong for these: a college network puts hundreds of
// students behind one address, and a single browser tab polling every few seconds used to exhaust a shared
// per-IP budget, which then blocked profile saves with "Too many requests". Must run AFTER requireParticipant.
export const participantActionLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 90,
    keyGenerator: (req) => `u:${req.participantAddovediId || 'anon'}`,
    validate: { keyGeneratorIpFallback: false },
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'You are doing that too quickly. Please wait a moment and try again.' }
});

// Baseline limiter for all other API traffic. Sized generously because the
// public site polls GET /api/events, /api/crew and /api/alliances every few
// seconds (see client polling intervals) so admin-portal edits show up
// without a manual reload — a single visitor browsing a few pages can
// legitimately generate a few hundred GETs in a 15 minute window.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30000, // per IP; shared campus Wi-Fi. Real abuse limits are per-account (login/registration/action limiters)
    // The polled public read endpoints are cached server-side (see utils/publicCache.js) and
    // covered by publicReadLimiter below instead, so a shared campus IP polling them can't
    // exhaust this budget and lock everyone on that network out of login/registration.
    skip: (req) => isPublicPoll(req),
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' }
});
