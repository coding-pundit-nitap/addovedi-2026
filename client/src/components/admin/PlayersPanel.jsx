import { useMemo, useState } from 'react';

const mono = { fontFamily: 'monospace', fontSize: 11 };
const norm = (v) => (v || '').trim().toLowerCase();

// Every registration this Addovedi ID is part of, as leader or as a team member.
export function playerRegistrations(registrations, addovediId) {
    const id = norm(addovediId);
    return registrations
        .filter(r => norm(r.leaderUID) === id || (r.members || []).some(m => norm(m.uid) === id))
        .map(r => ({ ...r, role: norm(r.leaderUID) === id ? 'LEADER' : 'MEMBER' }));
}

const STATUS_COLOR = { VERIFIED: '#1FFF76', PENDING_UNSTOP_VERIFICATION: '#FBBF24', CANCELLED: '#FF4D6D' };

export function PlayerProfileModal({ player, registrations, onClose, onDelete }) {
    const regs = useMemo(() => (player ? playerRegistrations(registrations, player.addovediId) : []), [player, registrations]);
    if (!player) return null;
    const rows = [
        ['ADDOVEDI ID', player.addovediId], ['EMAIL', player.email], ['PHONE', player.phone],
        ['COLLEGE', player.college], ['DEPARTMENT', player.department], ['YEAR', player.year],
        ['CITY / STATE', [player.city, player.state].filter(Boolean).join(', ')], ['GENDER', player.gender],
        ['DATE OF BIRTH', player.dob], ['EMERGENCY CONTACT', player.emergencyContact],
        ['JOINED', player.createdAt ? new Date(player.createdAt).toLocaleString() : ''],
    ].filter(([, v]) => v);

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', background: '#0D1320', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 8, padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: '#fff', fontWeight: 900 }}>{player.name}</div>
                        <div style={{ ...mono, color: '#00E5FF', marginTop: 4 }}>{player.addovediId}</div>
                    </div>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: '1px solid #4B5563', color: '#9CA3AF', ...mono, padding: '4px 10px', cursor: 'pointer' }}>CLOSE</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, margin: '18px 0' }}>
                    {rows.map(([k, v]) => (
                        <div key={k} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 4 }}>
                            <div style={{ ...mono, fontSize: 9, color: '#6B7280', letterSpacing: '0.1em' }}>{k}</div>
                            <div style={{ ...mono, color: '#E5E7EB', marginTop: 2, wordBreak: 'break-word' }}>{v}</div>
                        </div>
                    ))}
                </div>

                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: '#00E5FF', letterSpacing: '0.15em', marginBottom: 8 }}>EVENTS ({regs.length})</div>
                {regs.length === 0 ? (
                    <div style={{ ...mono, color: '#6B7280' }}>Not registered in any event yet.</div>
                ) : regs.map(r => (
                    <div key={r._id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 12, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ ...mono, fontWeight: 900, color: '#fff' }}>{r.eventTitle}</span>
                            <span style={{ ...mono, color: STATUS_COLOR[r.status] || '#9CA3AF' }}>{(r.status || '').replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ ...mono, color: '#9CA3AF', marginTop: 4, lineHeight: 1.6 }}>
                            {r.categoryTitle} · Team: {r.teamName} · Role: <span style={{ color: r.role === 'LEADER' ? '#00E5FF' : '#E5E7EB' }}>{r.role}</span>
                            <br />Leader: {r.leaderName} ({r.leaderUID}){(r.members || []).length > 0 && <> · Members: {r.members.map(m => `${m.name} (${m.uid}) · ${m.status === 'REJECTED' ? 'DECLINED' : (m.status || 'ACCEPTED')}`).join(', ')}</>}
                            {r.unstopRefId && <><br />Unstop ref: {r.unstopRefId}</>}
                        </div>
                    </div>
                ))}

                {onDelete && (
                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button type="button" onClick={() => onDelete(player)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', ...mono, padding: '8px 16px', cursor: 'pointer', fontWeight: 900 }}>REMOVE PLAYER</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlayersPanel({ players, loading, registrations, onOpen, onDelete, onRefresh }) {
    const [q, setQ] = useState('');
    const list = useMemo(() => {
        const term = norm(q);
        return players.filter(p => !term || [p.name, p.addovediId, p.email, p.phone, p.college].some(v => norm(v).includes(term)));
    }, [players, q]);
    const counts = useMemo(() => {
        const m = {};
        players.forEach(p => { m[p.addovediId] = playerRegistrations(registrations, p.addovediId).filter(r => r.status !== 'CANCELLED').length; });
        return m;
    }, [players, registrations]);

    return (
        <div style={{ background: '#0D1320', padding: 24, borderRadius: 8, border: '1px solid rgba(0,229,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: '#00E5FF', letterSpacing: '0.15em' }}>REGISTERED PLAYERS ({players.length})</div>
                    <div style={{ ...mono, fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Everyone who created an Addovedi ID, whether or not they have joined an event. Click a row to see their profile and events.</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" placeholder="Search name, ID, email, phone, college..." value={q} onChange={e => setQ(e.target.value)} style={{ minWidth: 240 }} />
                    <button type="button" onClick={onRefresh} style={{ padding: '6px 14px', border: '1px solid #00E5FF', background: 'none', color: '#00E5FF', ...mono, cursor: 'pointer' }}>REFRESH</button>
                </div>
            </div>

            {loading && <div style={{ ...mono, color: '#9CA3AF' }}>Loading players...</div>}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', ...mono }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: 10 }}>
                            {['ADDOVEDI ID', 'NAME', 'EMAIL', 'PHONE', 'COLLEGE', 'EVENTS', 'JOINED', ''].map(h => <th key={h} style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(p => (
                            <tr key={p._id} onClick={() => onOpen(p.addovediId)} style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.05)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                <td style={{ padding: '8px', color: '#00E5FF' }}>{p.addovediId}</td>
                                <td style={{ padding: '8px', color: '#fff', fontWeight: 700 }}>{p.name}</td>
                                <td style={{ padding: '8px', color: '#D1D5DB' }}>{p.email}</td>
                                <td style={{ padding: '8px', color: '#D1D5DB' }}>{p.phone}</td>
                                <td style={{ padding: '8px', color: '#9CA3AF' }}>{p.college || '-'}</td>
                                <td style={{ padding: '8px', color: counts[p.addovediId] ? '#1FFF76' : '#6B7280' }}>{counts[p.addovediId] || 0}</td>
                                <td style={{ padding: '8px', color: '#6B7280' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</td>
                                <td style={{ padding: '8px' }}>
                                    <button type="button" onClick={e => { e.stopPropagation(); onDelete(p); }} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', ...mono, fontSize: 10, padding: '3px 8px', cursor: 'pointer' }}>REMOVE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && list.length === 0 && <div style={{ ...mono, color: '#6B7280', padding: 14 }}>No players found.</div>}
            </div>
        </div>
    );
}
