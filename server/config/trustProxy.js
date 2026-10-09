// Which hops count as "our own infrastructure" when working out the visitor's real IP from X-Forwarded-For.
//
// Express takes the RIGHTMOST address in X-Forwarded-For that is NOT trusted. With only `trust proxy: 1` on
// Render that rightmost address was Render's internal load balancer (172.16.x.x), so EVERY visitor shared one or two
// rate-limit buckets: one person's failed logins locked everybody out. Trusting private ranges plus Cloudflare's
// published edge ranges makes the first public address from the right the real client, in all setups:
//   - Render:        client -> Cloudflare -> Render LB (private) -> app
//   - college nginx:  client -> nginx (docker private) -> app
//   - local dev:     loopback
// Spoofing is not possible: anything an attacker puts in X-Forwarded-For sits to the LEFT of the real address.
// Override with TRUST_PROXY (a number of hops, or "true"/"false") only if the hosting setup changes.
const CLOUDFLARE = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
    '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
];

export function trustProxySetting() {
    const env = process.env.TRUST_PROXY;
    if (env) {
        if (env === 'true') return true;
        if (env === 'false') return false;
        if (/^\d+$/.test(env)) return Number(env);
        return env.split(',').map(s => s.trim()).filter(Boolean);
    }
    return ['loopback', 'linklocal', 'uniquelocal', ...CLOUDFLARE];
}
