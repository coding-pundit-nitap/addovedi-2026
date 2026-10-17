import { useEffect, useMemo, useState } from 'react';

// Admin: close / re-open registration for ONE event at a time (PATCH /events/sub/:id/registration).
// A closed event shows "Registration closed" and refuses new registrations and invites. Teams that are already
// registered are not touched, and it can be turned back on at any moment. The MAIN switch above still applies to every
// event: when it is not OPEN, all events show closed / starting soon no matter what is set here.
const mono = { fontFamily: 'monospace' };
const orb = { fontFamily: "'Orbitron', monospace" };

export default function EventRegistrationSwitches({ apiBase, getHeaders, subEvents = [], onChanged, onUnauthorized }) {
    const [closed, setClosed] = useState({});   // id -> true/false (what the admin has set)
    const [busyId, setBusyId] = useState(null);
    const [mainMode, setMainMode] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { setClosed(Object.fromEntries(subEvents.map(e => [e._id, e.registrationClosed === true]))); }, [subEvents]);
    useEffect(() => {
        let alive = true;
        fetch(`${apiBase}/settings/registration`, { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(d => { if (alive && d) setMainMode(d.registrationMode || (d.registrationOpen ? 'open' : 'soon')); }).catch(() => {});
        return () => { alive = false; };
    }, [apiBase]);

    const groups = useMemo(() => {
        const m = {};
        subEvents.forEach(e => { (m[e.categoryTitle] = m[e.categoryTitle] || []).push(e); });
        return Object.entries(m).sort(([a], [b]) => a.localeCompare(b));
    }, [subEvents]);
    const closedCount = subEvents.filter(e => closed[e._id]).length;

    const toggle = async (e) => {
        const next = !closed[e._id];
        if (!confirm(next
            ? `CLOSE registration for "${e.title}"?\n\nVisitors will see "Registration closed" for this event and new registrations / invites are refused. Teams already registered are NOT affected. You can re-open it any time.`
            : `RE-OPEN registration for "${e.title}"?${mainMode && mainMode !== 'open' ? '\n\nNote: the MAIN registration switch is not OPEN, so this event will still show closed / starting soon until it is.' : ''}`)) return;
        setBusyId(e._id); setError('');
        try {
            const res = await fetch(`${apiBase}/events/sub/${e._id}/registration`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ closed: next }) });
            if (res.status === 401) { onUnauthorized?.(); return; }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setError(data.message || 'Could not change this event. Nothing was changed.'); return; }
            setClosed(c => ({ ...c, [e._id]: data.registrationClosed === true }));
            onChanged?.();
        } catch { setError('Network error. Nothing was changed.'); }
        finally { setBusyId(null); }
    };

    if (!subEvents.length) return null;
    return (
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 14, margin: '12px 0', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ ...orb, fontSize: 11, color: '#00E5FF', letterSpacing: '0.14em' }}>REGISTRATION BY EVENT {closedCount > 0 && <span style={{ color: '#f87171' }}>· {closedCount} CLOSED</span>}</div>
            <div style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '4px 0 10px' }}>
                Close one event without touching the others. Already-registered teams are not affected, and you can re-open it any time.
                {mainMode && mainMode !== 'open' && <span style={{ color: '#FBBF24' }}> The MAIN switch is {mainMode === 'closed' ? 'CLOSED' : 'on STARTING SOON'}, so every event shows that regardless of the switches below.</span>}
            </div>
            {error && <div style={{ ...mono, fontSize: 11, color: '#f87171', marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                {groups.map(([cat, evs]) => evs.map(e => (
                    <div key={e._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: `1px solid ${closed[e._id] ? 'rgba(248,113,113,0.4)' : 'rgba(31,255,118,0.25)'}`, borderRadius: 4, padding: '7px 10px' }}>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ ...mono, fontSize: 11, color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                            <div style={{ ...mono, fontSize: 9, color: closed[e._id] ? '#f87171' : '#1FFF76' }}>{cat} · {closed[e._id] ? 'CLOSED' : 'OPEN'}</div>
                        </div>
                        <button disabled={busyId === e._id} onClick={() => toggle(e)} style={{ ...orb, fontSize: 8, fontWeight: 800, padding: '6px 9px', borderRadius: 3, cursor: 'pointer', border: `1px solid ${closed[e._id] ? '#1FFF76' : '#f87171'}`, color: closed[e._id] ? '#1FFF76' : '#f87171', background: 'transparent' }}>
                            {busyId === e._id ? '…' : closed[e._id] ? 'RE-OPEN' : 'CLOSE'}
                        </button>
                    </div>
                )))}
            </div>
        </div>
    );
}
