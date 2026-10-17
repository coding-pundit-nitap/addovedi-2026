/**
 * ChangePasswordPanel.jsx: "change my password" section of the player profile.
 * Opens by itself (with a notice) right after an admin reset, when the player is on a temporary password.
 * Self-contained styles on purpose (see CLAUDE.md note on shared CSS).
 */
import { useState } from 'react';
import { API_BASE } from '../../constants/api';

export default function ChangePasswordPanel({ user, onChanged }) {
    const forced = user?.mustChangePassword === true;
    const [open, setOpen] = useState(forced);
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [msg, setMsg] = useState({ text: '', ok: false });
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setMsg({ text: '', ok: false });
        if (next.length < 8) return setMsg({ text: 'New password must be at least 8 characters.', ok: false });
        if (next !== confirm) return setMsg({ text: 'New passwords do not match.', ok: false });
        setBusy(true);
        try {
            const res = await fetch(`${API_BASE}/participants/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token || ''}` },
                body: JSON.stringify({ currentPassword: current, newPassword: next })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMsg({ text: data.message || 'Could not change password.', ok: false });
                return;
            }
            setCurrent(''); setNext(''); setConfirm('');
            setMsg({ text: 'Password updated.', ok: true });
            onChanged && onChanged(data.token);
            setOpen(false);
        } catch {
            setMsg({ text: 'Network error. Please try again.', ok: false });
        } finally {
            setBusy(false);
        }
    };

    const field = { width: '100%', padding: '8px 10px', background: 'rgba(2,5,12,.85)', border: '1px solid rgba(0,217,255,.25)', color: '#fff', fontSize: 12, outline: 'none' };

    return (
        <div style={{ marginTop: 10, border: `1px solid ${forced ? 'rgba(245,158,11,.6)' : 'rgba(255,255,255,.12)'}`, background: forced ? 'rgba(245,158,11,.06)' : 'transparent' }}>
            <button type="button" onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', color: forced ? '#F59E0B' : '#9CA3AF', fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer', textAlign: 'left' }}>
                {forced ? '⚠ SET YOUR OWN PASSWORD (YOU ARE ON A TEMPORARY ONE)' : '🔑 CHANGE PASSWORD'} {open ? '▲' : '▼'}
            </button>
            {open && (
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 12px' }}>
                    {forced && <div style={{ fontSize: 11, color: '#F59E0B' }}>An organiser reset your password. Enter the temporary password as "current", then choose a new one.</div>}
                    <input type="password" autoComplete="current-password" placeholder="Current password" value={current} onChange={e => setCurrent(e.target.value)} style={field} />
                    <input type="password" autoComplete="new-password" placeholder="New password (min 8 characters)" value={next} onChange={e => setNext(e.target.value)} style={field} />
                    <input type="password" autoComplete="new-password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} style={field} />
                    {msg.text && <div style={{ fontSize: 11, color: msg.ok ? '#1FFF76' : '#f87171' }}>{msg.text}</div>}
                    <button type="submit" disabled={busy} style={{ padding: '8px', background: 'rgba(0,217,255,.12)', border: '1px solid #00D9FF', color: '#00D9FF', fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
                        {busy ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </button>
                </form>
            )}
            {!open && msg.ok && <div style={{ fontSize: 11, color: '#1FFF76', padding: '0 12px 10px' }}>{msg.text}</div>}
        </div>
    );
}
