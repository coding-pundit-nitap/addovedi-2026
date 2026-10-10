import { API_BASE } from '../constants/api';

// Fetches every registration a given Addovedi ID is part of (as leader OR
// team member) directly from the server — the single source of truth for
// "am I registered for this" and "has admin verified it", replacing the old
// localStorage-only cache that only the team leader's own browser ever had.
export async function fetchMyRegistrations(addovediId) {
    if (!addovediId) return [];
    try {
        let token = '';
        try { token = JSON.parse(localStorage.getItem('addovedi_user') || 'null')?.token || ''; } catch { /* no session */ }
        const res = await fetch(`${API_BASE}/registrations/my/${encodeURIComponent(addovediId)}`, {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.log('Failed to fetch my registrations');
        return [];
    }
}

// Teammate answers a team invite: accept = true joins, false declines/leaves.
// Returns { ok, message }.
// Fired after any invite answer so the notification bar / profile refresh immediately.
export const INVITES_CHANGED_EVENT = 'addovedi:invites-changed';

export async function respondToTeamInvite(registrationId, accept) {
    try {
        let token = '';
        try { token = JSON.parse(localStorage.getItem('addovedi_user') || 'null')?.token || ''; } catch { /* no session */ }
        const res = await fetch(`${API_BASE}/registrations/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ registrationId, accept })
        });
        const data = await res.json().catch(() => ({}));
        window.dispatchEvent(new Event(INVITES_CHANGED_EVENT));
        return { ok: res.ok, message: data.message || (res.ok ? 'Done' : 'Could not update your response.') };
    } catch {
        return { ok: false, message: 'Network error. Please try again.' };
    }
}

export const memberMeta = (m) => (m?.status === 'REJECTED' && m?.expired ? { label: 'EXPIRED', color: '#9CA3AF' } : (MEMBER_STATUS_META[m?.status] || MEMBER_STATUS_META.ACCEPTED));
export const MEMBER_STATUS_META = {
    PENDING: { label: 'PENDING', color: '#F59E0B' },
    ACCEPTED: { label: 'ACCEPTED', color: '#1FFF76' },
    REJECTED: { label: 'DECLINED', color: '#ff1f4f' }
};
