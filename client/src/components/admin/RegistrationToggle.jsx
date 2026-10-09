import { useEffect, useState } from 'react';

// Admin on/off switch backed by GET/PUT /settings/<path> ({ [flag]: boolean }).
export default function SiteToggle({ apiBase, getHeaders, onUnauthorized, path = 'registration', flag = 'registrationOpen', title = 'EVENT REGISTRATION', onLabel = 'OPEN', offLabel = 'CLOSED (STARTING SOON)', onButton = 'CLOSE REGISTRATION', offButton = 'OPEN REGISTRATION', onHint, offHint, confirmOn, confirmOff }) {
    const [open, setOpen] = useState(null); // null = loading
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch(`${apiBase}/settings/${path}`, { cache: 'no-store' })
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then(d => { if (!cancelled) setOpen(d[flag] === true); })
            .catch(() => { if (!cancelled) setOpen(undefined); });
        return () => { cancelled = true; };
    }, [apiBase, path, flag]);

    const toggle = async () => {
        const next = !open;
        if (!confirm(next ? confirmOn : confirmOff)) return;
        setBusy(true);
        try {
            const res = await fetch(`${apiBase}/settings/${path}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ [flag]: next }) });
            if (res.status === 401) { alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.'); onUnauthorized?.(); return; }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
            setOpen(data[flag] === true);
        } catch (err) {
            alert(`Could not change setting: ${err.message}`);
        } finally {
            setBusy(false);
        }
    };

    const color = open ? '#1FFF76' : '#FBBF24';
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', border: `1px solid ${color}55`, background: `${color}0d`, borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
            <div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: '0.15em', color }}>
                    {title}: {open === null ? 'CHECKING...' : open === undefined ? 'UNAVAILABLE' : open ? onLabel : offLabel}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', marginTop: 4, lineHeight: 1.5 }}>
                    {open === undefined ? 'Could not reach the server. The backend may need a redeploy.' : open ? onHint : offHint}
                </div>
            </div>
            <button type="button" onClick={toggle} disabled={busy || open === null || open === undefined}
                style={{ padding: '10px 22px', border: 'none', background: open ? '#EF4444' : '#1FFF76', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: busy ? 'wait' : 'pointer', opacity: open === null || open === undefined ? 0.4 : 1 }}>
                {busy ? 'SAVING...' : open ? onButton : offButton}
            </button>
        </div>
    );
}
