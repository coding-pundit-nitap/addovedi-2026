// Verifies a Cloudflare Turnstile token server-side via their siteverify API.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
export async function verifyTurnstileToken(token, remoteIp) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        // Fail closed in production (never silently skip the check once a
        // secret is expected to be configured); fail open only when no
        // secret has been set at all, so local dev without Turnstile
        // configured still works.
        if (process.env.NODE_ENV === 'production') {
            console.error('[TURNSTILE] TURNSTILE_SECRET_KEY is not set in production.');
            return false;
        }
        return true;
    }
    if (typeof token !== 'string' || !token) return false;

    try {
        const body = new URLSearchParams({ secret, response: token });
        if (remoteIp) body.append('remoteip', remoteIp);

        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        const data = await res.json();
        return data.success === true;
    } catch (err) {
        console.error('[TURNSTILE] Verification request failed:', err.message);
        return false;
    }
}
