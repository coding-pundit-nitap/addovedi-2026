/**
 * InviteBar.jsx: site-wide notification bar for team invites.
 * Shows (for a logged-in player) every team that added them and is waiting on their answer,
 * with inline Accept / Decline and a link to the event. Polls quietly; hidden on the admin page.
 * Self-contained styles on purpose (see CLAUDE.md note on shared CSS).
 */
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchMyRegistrations, respondToTeamInvite, INVITES_CHANGED_EVENT } from '../../utils/registrations';
import { ADMIN_PATH } from '../../constants/routes';
import { slugify } from '../../data/events';

const POLL_MS = 20000;

const readUser = () => {
    try { return JSON.parse(localStorage.getItem('addovedi_user') || 'null'); } catch { return null; }
};

export default function InviteBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [invites, setInvites] = useState([]);
    const [open, setOpen] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const refresh = useCallback(async () => {
        const user = readUser();
        if (!user?.addovediId || !user?.token) { setInvites([]); return; }
        const regs = await fetchMyRegistrations(user.addovediId);
        setInvites(regs.filter(r => r.myStatus === 'PENDING'));
    }, []);

    useEffect(() => {
        refresh();
        const id = setInterval(() => { if (!document.hidden) refresh(); }, POLL_MS);
        window.addEventListener(INVITES_CHANGED_EVENT, refresh);
        window.addEventListener('storage', refresh);
        return () => {
            clearInterval(id);
            window.removeEventListener(INVITES_CHANGED_EVENT, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, [refresh]);

    // Re-check after navigation (e.g. right after logging in).
    useEffect(() => { refresh(); }, [location.pathname, refresh]);

    if (location.pathname === ADMIN_PATH || invites.length === 0) return null;

    const answer = async (reg, accept) => {
        setBusyId(reg.registrationId);
        const r = await respondToTeamInvite(reg.registrationId, accept);
        if (!r.ok) alert(r.message);
        setBusyId(null);
        refresh();
    };

    return (
        <div className="invite-bar" role="status">
            <style>{`
                .invite-bar{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9998;width:min(560px,94vw);font-family:'Rajdhani',sans-serif;}
                .invite-bar-head{display:flex;align-items:center;gap:10px;width:100%;padding:8px 14px;background:rgba(8,16,28,.96);border:1px solid #F59E0B;color:#fff;cursor:pointer;box-shadow:0 0 18px rgba(245,158,11,.35);}
                .invite-bar-head b{color:#F59E0B;font-family:'Orbitron',monospace;letter-spacing:.1em;font-size:11px;}
                .invite-bar-dot{width:8px;height:8px;border-radius:50%;background:#F59E0B;animation:invite-pulse 1.4s infinite;}
                @keyframes invite-pulse{0%,100%{opacity:1}50%{opacity:.3}}
                .invite-bar-list{background:rgba(8,16,28,.98);border:1px solid rgba(245,158,11,.5);border-top:none;max-height:50vh;overflow-y:auto;}
                .invite-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-top:1px solid rgba(255,255,255,.06);}
                .invite-row:first-child{border-top:none}
                .invite-btn{padding:6px 12px;font-family:'Orbitron',monospace;font-size:10px;font-weight:800;letter-spacing:.08em;background:transparent;cursor:pointer;}
                .invite-btn:disabled{opacity:.5;cursor:default}
            `}</style>
            <button type="button" className="invite-bar-head" onClick={() => setOpen(o => !o)}>
                <span className="invite-bar-dot" />
                <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>
                    <b>TEAM INVITE{invites.length > 1 ? `S (${invites.length})` : ''}</b>{' '}
                    {invites.length === 1 ? `${invites[0].leaderName} added you to a team for ${invites[0].eventTitle}` : 'You have teams waiting for your answer'}
                </span>
                <span style={{ color: '#F59E0B', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
            </button>
            {open && (
                <div className="invite-bar-list">
                    {invites.map(reg => (
                        <div className="invite-row" key={reg.registrationId}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{reg.eventTitle}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>
                                    Team "{reg.teamName}" · led by {reg.leaderName}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button type="button" className="invite-btn" style={{ color: '#00D9FF', border: '1px solid rgba(0,217,255,.5)' }}
                                    onClick={() => { setOpen(false); navigate(`/event/${slugify(reg.categoryTitle)}/${slugify(reg.eventTitle)}`); }}>VIEW</button>
                                <button type="button" className="invite-btn" disabled={busyId === reg.registrationId} style={{ color: '#1FFF76', border: '1px solid #1FFF76' }}
                                    onClick={() => answer(reg, true)}>ACCEPT</button>
                                <button type="button" className="invite-btn" disabled={busyId === reg.registrationId} style={{ color: '#f87171', border: '1px solid rgba(239,68,68,.6)' }}
                                    onClick={() => answer(reg, false)}>DECLINE</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
