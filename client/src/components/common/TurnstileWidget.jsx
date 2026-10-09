import { useEffect, useRef, useState } from 'react';
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
    const [failure, setFailure] = useState('');

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
                    'error-callback': (code) => { setFailure(String(code || 'unknown')); onError && onError(); return true; }
                });
            })
            .catch(() => { setFailure('script-blocked'); onError && onError(); });

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch (err) { /* already gone */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;
    return (
        <div>
            <div ref={containerRef} />
            {failure && (
                <div style={{ marginTop: 6, fontSize: 10, color: '#fca5a5', lineHeight: 1.5, letterSpacing: '0.05em' }}>
                    {failure === 'script-blocked'
                        ? 'The security check could not load. Your network may be blocking challenges.cloudflare.com.'
                        : `The security check failed (code ${failure}). Refresh and try again, or try another network.`}
                </div>
            )}
        </div>
    );
}
