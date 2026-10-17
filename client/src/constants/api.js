const getApiBase = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('172.') || hostname.startsWith('10.')) {
            return `http://${hostname}:5001/api`;
        }
    }
    return 'https://addovedi-2026.onrender.com/api';
};

export const API_BASE = getApiBase();

// Cloudflare Turnstile site key (public, safe to ship in the bundle).
// Set VITE_TURNSTILE_SITE_KEY in Vercel's project environment variables.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
