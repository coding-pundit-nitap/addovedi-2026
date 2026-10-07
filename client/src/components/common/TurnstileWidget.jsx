import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '../../constants/api';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
let scriptLoadPromise = null;

function loadTurnstileScript() {
    if (window.turnstile) return Promise.resolve();
    if (scriptLoadPromise) return scriptLoadPromise;
    scriptLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Turnstile script'));
        document.head.appendChild(script);
    });
    return scriptLoadPromise;
}

// Renders a Cloudflare Turnstile CAPTCHA widget. Calls onVerify(token) when
// the visitor passes the challenge, and onExpire()/onError() if the token
// expires or the widget fails to load. If no site key is configured (local
// dev without Turnstile set up yet), renders nothing — the parent form is
// responsible for not requiring a token in that case.
export default function TurnstileWidget({ onVerify, onExpire, onError }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        if (!TURNSTILE_SITE_KEY || !containerRef.current) return;
        let cancelled = false;

        loadTurnstileScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) return;
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => onVerify && onVerify(token),
                    'expired-callback': () => onExpire && onExpire(),
                    'error-callback': () => onError && onError()
                });
            })
            .catch(() => onError && onError());

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch (err) { /* already gone */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;
    return <div ref={containerRef} />;
}
