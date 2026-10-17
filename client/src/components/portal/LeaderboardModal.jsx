import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE } from '../../constants/api';

// Leaderboard window: top players by XP plus the caller's own standing. Fetched once when opened (no polling).
export default function LeaderboardModal({ onClose }) {
    const [state, setState] = useState({ status: 'loading', data: null, message: '' });

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                let token = '';
                try { token = JSON.parse(localStorage.getItem('addovedi_user') || 'null')?.token || ''; } catch { /* no session */ }
                const res = await fetch(`${API_BASE}/leaderboard`, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json().catch(() => ({}));
                if (!alive) return;
                if (res.ok && Array.isArray(data.top)) setState({ status: 'ready', data, message: '' });
                else if (res.status === 404) setState({ status: 'error', data: null, message: 'The leaderboard is not live yet. Please check back soon.' });
                else if (res.status === 401) setState({ status: 'error', data: null, message: 'Please log in again to see the leaderboard.' });
                else setState({ status: 'error', data: null, message: res.status < 500 && data.message ? data.message : 'Could not load the leaderboard. Please try again.' });
            } catch {
                if (alive) setState({ status: 'error', data: null, message: 'Network error. Please try again.' });
            }
        })();
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        // Capture phase + stopPropagation so Escape closes only this window, not the profile window underneath it.
        const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [onClose]);

    const d = state.data;
    const medal = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '');
    return createPortal(
        <div
            role="dialog" aria-modal="true" aria-label="Leaderboard"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'Rajdhani', sans-serif" }}
        >
            <div style={{ width: 'min(520px, 100%)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', background: '#070d18', border: '1px solid #00D9FF', boxShadow: '0 0 30px rgba(0,217,255,0.25)', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(0,217,255,0.25)' }}>
                    <div>
                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', letterSpacing: '0.18em', color: '#00D9FF', fontWeight: 900 }}>ADDOVEDI 2026</div>
                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '17px', fontWeight: 900, letterSpacing: '0.08em' }}>🏆 LEADERBOARD</div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close leaderboard" style={{ width: 34, height: 34, border: '1px solid rgba(0,217,255,0.5)', background: 'transparent', color: '#00D9FF', fontSize: '16px', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ overflowY: 'auto', padding: '10px 14px 14px' }}>
                    {state.status === 'loading' && <div style={{ padding: '28px 0', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Loading the leaderboard...</div>}
                    {state.status === 'error' && <div style={{ padding: '28px 8px', textAlign: 'center', color: '#F59E0B', fontSize: '14px', lineHeight: 1.5 }}>{state.message}</div>}
                    {state.status === 'ready' && (
                        <>
                            <div style={{ border: '1px solid rgba(0,217,255,0.35)', background: 'rgba(0,217,255,0.08)', padding: '10px 12px', marginBottom: '10px', fontSize: '13px' }}>
                                {d.me.rank
                                    ? <>You are <strong style={{ color: '#00D9FF' }}>#{d.me.rank}</strong> of {d.totalPlayers} ranked players · Level {d.me.level} · {d.me.xp.toLocaleString('en-IN')} XP</>
                                    : <>You are not ranked yet. You earn <strong style={{ color: '#00D9FF' }}>{d.xpTeamEvent || d.xpPerRegistration} XP</strong> ({d.xpSingleEvent || 250} XP in single-player events) each time the admin verifies one of your registrations.</>}
                            </div>
                            {d.top.length === 0 ? (
                                <div style={{ padding: '22px 0', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>No one has earned XP yet. The first verified registration will start the board!</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '0.12em', textAlign: 'left' }}>
                                            <th style={{ padding: '4px 6px', width: 54 }}>RANK</th><th style={{ padding: '4px 6px' }}>PLAYER</th><th style={{ padding: '4px 6px', textAlign: 'right' }}>LVL</th><th style={{ padding: '4px 6px', textAlign: 'right' }}>XP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {d.top.map((p, i) => (
                                            <tr key={`${p.rank}-${i}`} style={{ background: p.isMe ? 'rgba(31,255,118,0.12)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.07)', color: p.isMe ? '#1FFF76' : '#fff' }}>
                                                <td style={{ padding: '7px 6px', fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>{medal(p.rank)} {p.rank}</td>
                                                <td style={{ padding: '7px 6px', wordBreak: 'break-word' }}>{p.name}{p.isMe ? ' (you)' : ''}</td>
                                                <td style={{ padding: '7px 6px', textAlign: 'right', fontFamily: "'Orbitron', monospace" }}>{p.level}</td>
                                                <td style={{ padding: '7px 6px', textAlign: 'right', fontFamily: "'Orbitron', monospace" }}>{p.xp.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <p style={{ margin: '12px 2px 0', fontSize: '11px', lineHeight: 1.5, color: 'rgba(255,255,255,0.5)' }}>
                                XP counts verified registrations only ({d.xpTeamEvent || d.xpPerRegistration} XP each, {d.xpSingleEvent || 250} XP in single-player events). Players with the same XP are ordered alphabetically by name. Gaming Nexus and Treasure Hunt register on Unstop and do not earn XP.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
