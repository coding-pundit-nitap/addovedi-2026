import { useEffect, useState } from 'react';

// Admin three-state switch for event registration: STARTING SOON / OPEN / CLOSED.
// Backed by GET/PUT /settings/registration ({ registrationMode: 'soon' | 'open' | 'closed' }).
const MODES = [
    { key: 'soon', label: 'STARTING SOON', color: '#FBBF24', hint: 'Visitors see "Registration starting soon". New registrations are refused.' },
    { key: 'open', label: 'OPEN', color: '#1FFF76', hint: 'Visitors can register for events.' },
    { key: 'closed', label: 'CLOSED', color: '#EF4444', hint: 'Visitors see "Registration closed". New registrations are refused.' }
];

export default function RegistrationModeToggle({ apiBase, getHeaders, onUnauthorized }) {
    const [mode, setMode] = useState(null); // null = loading, undefined = unreachable
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch(`${apiBase}/settings/registration`, { cache: 'no-store' })
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then(d => { if (!cancelled) setMode(d.registrationMode || (d.registrationOpen ? 'open' : 'soon')); })
            .catch(() => { if (!cancelled) setMode(undefined); });
        return () => { cancelled = true; };
    }, [apiBase]);

    const choose = async (next) => {
        if (next === mode) return;
        const meta = MODES.find(m => m.key === next);
        if (!confirm(`SET EVENT REGISTRATION TO "${meta.label}"?\n\n${meta.hint} Existing registrations are unaffected.`)) return;
        setBusy(true);
        try {
            const res = await fetch(`${apiBase}/settings/registration`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ registrationMode: next }) });
            if (res.status === 401) { alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.'); onUnauthorized?.(); return; }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
            setMode(data.registrationMode);
        } catch (err) {
            alert(`Could not change setting: ${err.message}`);
        } finally {
            setBusy(false);
        }
    };

    const current = MODES.find(m => m.key === mode);
    const color = current?.color || '#9CA3AF';
    return (
        <div style={{ border: `1px solid ${color}55`, background: `${color}0d`, borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: '0.15em', color }}>
                EVENT REGISTRATION: {mode === null ? 'CHECKING...' : mode === undefined ? 'UNAVAILABLE' : current.label}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', margin: '4px 0 12px', lineHeight: 1.5 }}>
                {mode === undefined ? 'Could not reach the server. The backend may need a redeploy.' : current?.hint}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MODES.map(m => (
                    <button key={m.key} type="button" onClick={() => choose(m.key)} disabled={busy || !mode}
                        style={{ padding: '10px 18px', border: `1px solid ${m.color}`, background: mode === m.key ? m.color : 'transparent', color: mode === m.key ? '#000' : m.color, fontFamily: 'monospace', fontWeight: 900, cursor: busy ? 'wait' : 'pointer', opacity: !mode ? 0.4 : 1 }}>
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
