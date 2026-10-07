import { API_BASE } from '../constants/api';

// Fetches every registration a given Addovedi ID is part of (as leader OR
// team member) directly from the server — the single source of truth for
// "am I registered for this" and "has admin verified it", replacing the old
// localStorage-only cache that only the team leader's own browser ever had.
export async function fetchMyRegistrations(addovediId) {
    if (!addovediId) return [];
    try {
        const res = await fetch(`${API_BASE}/registrations/my/${encodeURIComponent(addovediId)}`, { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.log('Failed to fetch my registrations');
        return [];
    }
}
