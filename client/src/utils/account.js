import { API_BASE } from '../constants/api';
import { useStore } from '../store/useStore';

// The browser keeps a copy of the signed-in player's account in localStorage (addovedi_user). If an admin corrects the
// account (name, email, phone, college...), this pulls the fresh values from the server and updates that copy, so the
// player's profile, the arena header, and the registration form show the corrected details without logging in again.
// Quiet on purpose: any failure (offline, expired session, password change pending) just leaves the copy as it was.
const FIELDS = ['name', 'email', 'phone', 'gender', 'dob', 'college', 'department', 'year', 'state', 'city', 'emergencyContact', 'avatar'];

export async function refreshMyAccount() {
    try {
        const stored = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
        if (!stored?.token) return;
        const res = await fetch(`${API_BASE}/participants/me`, { headers: { Authorization: `Bearer ${stored.token}` } });
        if (!res.ok) return;
        const fresh = await res.json();
        if (!fresh || fresh.addovediId !== stored.addovediId) return; // never mix up accounts
        const patch = {};
        for (const k of FIELDS) if (typeof fresh[k] === 'string' && fresh[k] !== (stored[k] ?? '')) patch[k] = fresh[k];
        if (!Object.keys(patch).length) return;
        // the copy may have changed while we were waiting (logout, another login): only write onto the same session
        const cur = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
        if (!cur || cur.token !== stored.token) return;
        const next = { ...cur, ...patch };
        localStorage.setItem('addovedi_user', JSON.stringify(next));
        useStore.getState().setCurrentUser(next);
        window.dispatchEvent(new Event('storage'));
    } catch { /* leave the cached copy as it is */ }
}
