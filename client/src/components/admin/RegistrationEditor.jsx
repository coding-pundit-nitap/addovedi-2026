import { useEffect, useMemo, useState } from 'react';

// Admin-only dialog to ADD a whole registration for any event, or EDIT an existing one (team name, contact details,
// teammates). Talks to POST /registrations/admin and PUT /registrations/:id/admin. The server re-checks everything
// (team size limits, real Addovedi accounts, nobody on two teams for one event), so the hints here are only a convenience.
const mono = { fontFamily: 'monospace' };
const orb = { fontFamily: "'Orbitron', monospace" };
const label = { ...orb, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)', marginBottom: 4, display: 'block' };
const input = { width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: '#05070d', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: 3, fontSize: 12, ...mono };
const btn = (c) => ({ ...orb, fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '10px 16px', border: `1px solid ${c}`, color: c, background: `${c}14`, borderRadius: 4, cursor: 'pointer' });

const STATUS_COLOR = { ACCEPTED: '#1FFF76', PENDING: '#F59E0B', REJECTED: '#f87171' };

export default function RegistrationEditor({ apiBase, getHeaders, mode, registration, subEvents = [], eventTitles = [], onClose, onSaved, onUnauthorized }) {
    const editing = mode === 'edit';
    const reg = registration || {};
    const [eventTitle, setEventTitle] = useState(editing ? reg.eventTitle : '');
    const [teamName, setTeamName] = useState(editing ? reg.teamName || '' : '');
    const [leaderUID, setLeaderUID] = useState(editing ? reg.leaderUID || '' : '');
    const [leaderName, setLeaderName] = useState(editing ? reg.leaderName || '' : '');
    const [leaderPhone, setLeaderPhone] = useState(editing ? reg.leaderPhone || '' : '');
    const [userEmail, setUserEmail] = useState(editing ? reg.userEmail || '' : '');
    const initialMembers = useMemo(() => (editing ? (reg.members || []).filter(m => m.status !== 'REJECTED').map(m => ({ uid: String(m.uid || '').toUpperCase(), status: m.status || 'ACCEPTED' })) : []), []); // eslint-disable-line react-hooks/exhaustive-deps
    const [members, setMembers] = useState(initialMembers.length ? initialMembers : (editing ? [] : [{ uid: '', status: 'NEW' }]));
    const [markVerified, setMarkVerified] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [players, setPlayers] = useState(null); // Map UPPER_ID -> player (read-only lookup, for hints only)

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`${apiBase}/participants`, { headers: getHeaders() });
                if (res.status === 401) { onUnauthorized?.(); return; }
                if (!res.ok) return;
                const list = await res.json();
                if (alive && Array.isArray(list)) setPlayers(new Map(list.map(p => [String(p.addovediId || '').toUpperCase(), p])));
            } catch { /* hints only */ }
        })();
        return () => { alive = false; };
    }, [apiBase]); // eslint-disable-line react-hooks/exhaustive-deps

    const ev = subEvents.find(e => e.title === eventTitle);
    const liveUids = members.map(m => m.uid.trim().toUpperCase()).filter(Boolean);
    const size = 1 + liveUids.length;
    const sizeBad = ev && (size < ev.minTeam || size > ev.maxTeam);
    const range = ev ? (ev.minTeam === ev.maxTeam ? `exactly ${ev.minTeam}` : `${ev.minTeam} to ${ev.maxTeam}`) : null;
    const lookup = (uid) => {
        const u = String(uid || '').trim().toUpperCase();
        if (!u || !players) return null;
        const p = players.get(u);
        return p ? { ok: true, text: `${p.name}${p.phone ? ' · ' + p.phone : ''}` } : { ok: false, text: 'No account with this ID' };
    };
    const dup = new Set(liveUids.filter((u, i) => liveUids.indexOf(u) !== i));

    const setMember = (i, uid) => setMembers(ms => ms.map((m, k) => (k === i ? { ...m, uid: uid.toUpperCase() } : m)));
    const removeMember = (i) => setMembers(ms => ms.filter((_, k) => k !== i));
    const addMember = () => setMembers(ms => [...ms, { uid: '', status: 'NEW' }]);

    const save = async () => {
        setError('');
        if (!editing && !eventTitle) return setError('Choose an event.');
        if (!teamName.trim()) return setError('Enter a team name.');
        if (!editing && !leaderUID.trim()) return setError('Enter the team leader\'s Addovedi ID.');
        const summary = editing
            ? `Save these changes to the LIVE registration "${reg.teamName}" (${reg.eventTitle})?\n\nTeam size will be ${size}.${reg.teamId ? `\nThe Team ID ${reg.teamId} stays the same.` : ''}`
            : `Add this registration to the LIVE database?\n\nEvent: ${eventTitle}\nTeam: ${teamName.trim()}\nLeader: ${leaderUID.trim().toUpperCase()}\nTeammates: ${liveUids.join(', ') || 'none'}\nTeam size: ${size}${markVerified ? '\nIt will also be marked VERIFIED.' : ''}\n\nEveryone is added as accepted (no invites).`;
        if (!confirm(summary)) return;
        setSaving(true);
        try {
            let res;
            if (editing) {
                const body = {};
                if (teamName.trim() !== (reg.teamName || '')) body.teamName = teamName.trim();
                if (leaderName.trim() !== (reg.leaderName || '')) body.leaderName = leaderName.trim();
                if (leaderPhone.trim() !== (reg.leaderPhone || '')) body.leaderPhone = leaderPhone.trim();
                if (userEmail.trim() !== (reg.userEmail || '')) body.userEmail = userEmail.trim();
                const before = initialMembers.map(m => m.uid).sort().join('|');
                if (before !== [...liveUids].sort().join('|')) body.members = liveUids;
                if (!Object.keys(body).length) { setSaving(false); return setError('Nothing was changed.'); }
                res = await fetch(`${apiBase}/registrations/${reg._id}/admin`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) });
            } else {
                res = await fetch(`${apiBase}/registrations/admin`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ eventTitle, teamName: teamName.trim(), leaderUID: leaderUID.trim(), members: liveUids, markVerified }) });
            }
            if (res.status === 401) { onUnauthorized?.(); return; }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setError(data.message || 'Could not save.'); return; }
            onSaved?.(data.registration);
            onClose();
        } catch (e) {
            setError('Network error. Nothing was saved. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const rejected = editing ? (reg.members || []).filter(m => m.status === 'REJECTED') : [];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '4vh 12px' }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 640, background: '#080b14', border: '1px solid rgba(0,229,255,0.4)', borderRadius: 6, padding: 18, boxShadow: '0 0 40px rgba(0,229,255,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                        <div style={{ ...orb, fontSize: 12, color: '#00E5FF', letterSpacing: '0.14em' }}>{editing ? 'EDIT REGISTRATION' : 'ADD REGISTRATION'}</div>
                        <div style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
                            {editing ? `${reg.eventTitle}${reg.teamId ? ' · ' + reg.teamId : ''}${reg.status === 'VERIFIED' ? ' · VERIFIED' : ''}` : 'Everyone you add joins as accepted (no invites). Team size rules still apply.'}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ ...mono, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }} aria-label="Close">✕</button>
                </div>

                {!editing && (
                    <div style={{ marginBottom: 12 }}>
                        <label style={label}>EVENT</label>
                        <select value={eventTitle} onChange={e => setEventTitle(e.target.value)} style={input}>
                            <option value="">Select an event…</option>
                            {eventTitles.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {ev && <div style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Team of {range} (including the leader)</div>}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={label}>TEAM NAME</label>
                        <input value={teamName} onChange={e => setTeamName(e.target.value)} maxLength={100} style={input} />
                    </div>
                    <div>
                        <label style={label}>TEAM LEADER ADDOVEDI ID</label>
                        <input value={leaderUID} onChange={e => setLeaderUID(e.target.value.toUpperCase())} disabled={editing} placeholder="ADV26-0001" style={{ ...input, opacity: editing ? 0.6 : 1 }} />
                        {!editing && (() => { const l = lookup(leaderUID); return l ? <div style={{ ...mono, fontSize: 10, marginTop: 4, color: l.ok ? '#1FFF76' : '#f87171' }}>{l.text}</div> : null; })()}
                    </div>
                    {editing && (
                        <div>
                            <label style={label}>LEADER NAME</label>
                            <input value={leaderName} onChange={e => setLeaderName(e.target.value)} maxLength={100} style={input} />
                        </div>
                    )}
                    {editing && (
                        <>
                            <div>
                                <label style={label}>LEADER PHONE</label>
                                <input value={leaderPhone} onChange={e => setLeaderPhone(e.target.value)} maxLength={20} style={input} />
                            </div>
                            <div>
                                <label style={label}>CONTACT EMAIL</label>
                                <input value={userEmail} onChange={e => setUserEmail(e.target.value)} maxLength={254} style={input} />
                            </div>
                        </>
                    )}
                </div>

                <label style={label}>TEAMMATES (BESIDES THE LEADER)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                    {members.map((m, i) => {
                        const l = lookup(m.uid);
                        return (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <input value={m.uid} onChange={e => setMember(i, e.target.value)} placeholder="Addovedi ID, e.g. ADV26-0002" style={{ ...input, borderColor: dup.has(m.uid.trim().toUpperCase()) ? '#f87171' : undefined }} />
                                    {l && <div style={{ ...mono, fontSize: 10, marginTop: 3, color: l.ok ? '#1FFF76' : '#f87171' }}>{l.text}</div>}
                                    {dup.has(m.uid.trim().toUpperCase()) && <div style={{ ...mono, fontSize: 10, color: '#f87171' }}>Listed twice</div>}
                                </div>
                                {m.status !== 'NEW' && <span style={{ ...orb, fontSize: 8, color: STATUS_COLOR[m.status] || '#fff', border: `1px solid ${STATUS_COLOR[m.status] || '#fff'}66`, padding: '5px 7px', borderRadius: 3, marginTop: 4 }}>{m.status}</span>}
                                <button onClick={() => removeMember(i)} style={{ ...btn('#ff1f4f'), padding: '7px 10px' }} title="Remove from team">REMOVE</button>
                            </div>
                        );
                    })}
                </div>
                <button onClick={addMember} style={{ ...btn('#00E5FF'), marginBottom: 10 }}>+ ADD TEAMMATE</button>

                {rejected.length > 0 && (
                    <div style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                        Earlier declined / expired invites (history, not on the team): {rejected.map(m => m.uid).join(', ')}
                    </div>
                )}
                {editing && members.some(m => m.status === 'PENDING') && (
                    <div style={{ ...mono, fontSize: 10, color: '#F59E0B', marginBottom: 8 }}>Teammates marked PENDING keep their pending invite. Remove and re-add them to put them on the team directly.</div>
                )}

                <div style={{ ...mono, fontSize: 11, marginBottom: 10, color: sizeBad ? '#f87171' : 'rgba(255,255,255,0.7)' }}>
                    Team size: {size}{range ? ` (this event allows ${range})` : ''}{sizeBad ? ' · outside the allowed range, the server will refuse it' : ''}
                </div>

                {!editing && (
                    <label style={{ ...mono, fontSize: 11, color: 'rgba(255,255,255,0.75)', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}>
                        <input type="checkbox" checked={markVerified} onChange={e => setMarkVerified(e.target.checked)} />
                        Also mark it VERIFIED (use when you have already checked this team on Unstop)
                    </label>
                )}

                {error && <div style={{ ...mono, fontSize: 11, color: '#f87171', border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.08)', padding: '8px 10px', marginBottom: 10 }}>{error}</div>}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} disabled={saving} style={btn('#9aa4b2')}>CANCEL</button>
                    <button onClick={save} disabled={saving} style={btn('#1FFF76')}>{saving ? 'SAVING…' : editing ? 'SAVE CHANGES' : 'ADD REGISTRATION'}</button>
                </div>
            </div>
        </div>
    );
}
