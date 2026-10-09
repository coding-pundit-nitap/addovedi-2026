/**
 * AdminPage.jsx — ADDOVEDI HQ ADMIN PORTAL
 *
 * Implements a command center dashboard for managing all techfest data:
 *  • Immersive cyber-themed Admin Login Portal with keypress styling
 *  • Headquarters dynamic database CRUD tabs:
 *     - Sector Status: Real-time toggles for sector availability dashboards
 *     - Inbox Messages: View/delete contact messages saved in MongoDB
 *     - Events Manager: Create, edit, and delete event categories & sub-events
 *     - Crew Personnel: Manage team lists, roles, and stats
 *     - Sponsor Alliances: Update corporate sponsors and categories
 *  • Hybrid endpoint routing (local CORS port 5000 fallback or path mappings)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollIndicator from '../common/ScrollIndicator';
import UnstopReconcile from './UnstopReconcile';
import SiteToggle from './RegistrationToggle';
import PlayersPanel, { PlayerProfileModal } from './PlayersPanel';
import { API_BASE } from '../../constants/api';
import { CARD_DATA } from '../../data/events';

export default function AdminPage() {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth < 768;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pageRef = useRef(null);
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
    const [username, setUsername] = useState(localStorage.getItem('admin_username') || '');
    
    // Login form fields
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [authError, setAuthError] = useState('');
    const [authenticating, setAuthenticating] = useState(false);

    // Active Dashboard Tab
    const [activeTab, setActiveTab] = useState('status'); // 'status' | 'messages' | 'events' | 'crew' | 'sponsors'

    // Status Settings state
    const [generalQueries, setGeneralQueries] = useState('ONLINE');
    const [sponsors, setSponsors] = useState('AVAILABLE');
    const [events, setEvents] = useState('ONLINE');
    const [media, setMedia] = useState('RESPONDING');
    const [statusSaving, setStatusSaving] = useState(false);

    // Inbox Messages state
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Events Database state
    const [categories, setCategories] = useState(CARD_DATA);
    const [subEvents, setSubEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Crew Database state
    const [crew, setCrew] = useState([]);
    const [loadingCrew, setLoadingCrew] = useState(false);

    // Sponsors state
    const [alliances, setAlliances] = useState([]);
    const [sponsorCategories, setSponsorCategories] = useState([]);
    const [newSponsorCategory, setNewSponsorCategory] = useState({ name: '', priority: 3, color: '#00E5FF' });
    const [loadingSponsors, setLoadingSponsors] = useState(false);

    // Change Password state
    const [changePwForm, setChangePwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changePwLoading, setChangePwLoading] = useState(false);
    const [changePwMsg, setChangePwMsg] = useState({ type: '', text: '' }); // type: 'success'|'error'

    // CRUD Forms states
    const [editingSubEvent, setEditingSubEvent] = useState(null);
    const [editingCrew, setEditingCrew] = useState(null);
    const [editingSponsor, setEditingSponsor] = useState(null);

    // New Data Add states
    const emptyTimeline = { day: '', time: '', end: '', venue: '', mode: 'Solo', prize: '' };
    // Bucket 1 is "Day Zero" (Oct 28, from 5PM), 2 is Day 1 (Oct 29), 3 is Day 2
    // (Oct 30) — kept as the stored values so existing scheduled sub-events
    // don't need migrating if the calendar dates ever shift again.
    const DAY_LABELS = { 1: 'DAY ZERO — OCT 28', 2: 'DAY 1 — OCT 29', 3: 'DAY 2 — OCT 30' };
    const [newSub, setNewSub] = useState({ categoryTitle: '', title: '', subtitle: '', desc: '', overview: '', minTeam: 1, maxTeam: 5, color: '#00d9ff', xp: '1,500 XP', difficulty: 'MEDIUM', iconType: 'code', modelType: 'coding', unstopUrl: 'https://unstop.com', heads: [{ name: '', phone: '' }, { name: '', phone: '' }], timeline: { ...emptyTimeline } });
    const [newCrew, setNewCrew] = useState({ name: '', role: '', avatar: '', type: 'STUDENT', category: 'HEAD', statText: 'MISSIONS CODE', statVal: 10, featured: false, featuredHeading: '', bio: '', links: [] });
    const [newSponsor, setNewSponsor] = useState({ name: '', category: 'GOLD', sub: 'Technology Sponsor', logo: 'NV', logoImage: '', desc: '', support: '', url: '#' });

    const [uploadingImage, setUploadingImage] = useState(false);

    // Event Registrations state
    const [registrations, setRegistrations] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [viewPlayerUid, setViewPlayerUid] = useState(null);
    const [registrationStats, setRegistrationStats] = useState(null);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [regSearchTerm, setRegSearchTerm] = useState('');
    const [regViewMode, setRegViewMode] = useState('participants'); // 'participants' | 'events'
    const [selectedEventRoster, setSelectedEventRoster] = useState(null);

    // Audit Logs state
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

    // Auto-fetch data on token auth state
    useEffect(() => {
        if (token) {
            fetchStatusSettings();
            fetchMessages();
            fetchEvents();
            fetchCrew();
            fetchSponsors();
            fetchRegistrations();
        }
    }, [token]);

    /* =========================================================================
       API SERVICES / FETCH CALLS
       ========================================================================= */
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Helper for safely parsing JSON or HTML/text error responses
    const safeFetchJson = async (res) => {
        try {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await res.json();
            }
            const text = await res.text();
            const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
            return {
                message: cleanText ? cleanText.substring(0, 250) : `Server returned non-JSON response (HTTP ${res.status} ${res.statusText || ''})`
            };
        } catch (err) {
            return { message: err.message || 'Error processing response' };
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await safeFetchJson(res);
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            if (type === 'crew') {
                if (editingCrew) {
                    setEditingCrew({ ...editingCrew, avatar: data.url });
                    // Persist immediately: a photo upload shouldn't be lost if the
                    // admin navigates away without separately clicking "Save Edit".
                    if (editingCrew._id) await persistField('crew', editingCrew._id, { avatar: data.url });
                } else {
                    setNewCrew({ ...newCrew, avatar: data.url });
                }
            } else if (type === 'sponsor') {
                if (editingSponsor) {
                    setEditingSponsor({ ...editingSponsor, logoImage: data.url });
                    if (editingSponsor._id) await persistField('alliances', editingSponsor._id, { logoImage: data.url });
                } else {
                    setNewSponsor({ ...newSponsor, logoImage: data.url });
                }
            }
            alert('Image uploaded and saved successfully.');
        } catch (err) {
            alert(`Upload Error: ${err.message}`);
        } finally {
            setUploadingImage(false);
        }
    };

    // Persists a single field on an already-existing record right away (used
    // after an image upload) instead of waiting for the admin to separately
    // submit the edit form.
    const persistField = async (resource, id, fields) => {
        try {
            const res = await fetch(`${API_BASE}/${resource}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(fields)
            });
            if (!res.ok) {
                const data = await safeFetchJson(res);
                throw new Error(data.message || `Failed to save (HTTP ${res.status})`);
            }
            if (resource === 'crew') fetchCrew();
            if (resource === 'alliances') fetchSponsors();
        } catch (err) {
            alert(`Error saving uploaded image: ${err.message}`);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthenticating(true);
        setAuthError('');
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const data = await safeFetchJson(res);
            if (!res.ok) throw new Error(data.message || 'Authorization Failed');
            
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_username', data.username);
            setToken(data.token);
            setUsername(data.username);
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setAuthenticating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        setToken('');
        setUsername('');
    };

    // HQ Sector availability fetching
    const fetchStatusSettings = async () => {
        try {
            const res = await fetch(`${API_BASE}/status-settings`);
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (data.generalQueries) setGeneralQueries(data.generalQueries);
                if (data.sponsors) setSponsors(data.sponsors);
                if (data.events) setEvents(data.events);
                if (data.media) setMedia(data.media);
            }
        } catch (err) {
            console.error('Failed status fetch', err);
        }
    };

    const saveStatusSettings = async () => {
        setStatusSaving(true);
        try {
            const res = await fetch(`${API_BASE}/status-settings`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ generalQueries, sponsors, events, media })
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || 'Failed to update status');
            }
            alert('SYSTEM STATUS RE-CONFIGURED');
        } catch (err) {
            alert(`Status Update Error: ${err.message}`);
        } finally {
            setStatusSaving(false);
        }
    };

    // Messages Inbox fetching
    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`${API_BASE}/messages`, { headers: getHeaders() });
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (Array.isArray(data)) setMessages(data);
            } else if (res.status === 401) {
                handleLogout();
                alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingMessages(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('PURGE CONTACT MSG PERMANENTLY?')) return;
        try {
            const res = await fetch(`${API_BASE}/messages/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (res.ok) {
                setMessages(prev => prev.filter(m => m._id !== id));
            } else {
                alert(data.message || 'Failed to delete message');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Event Registrations fetching
    const fetchRegistrations = async () => {
        setLoadingRegistrations(true);
        try {
            const res = await fetch(`${API_BASE}/registrations`, { headers: getHeaders() });
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (Array.isArray(data)) setRegistrations(data);
            } else if (res.status === 401) {
                handleLogout();
                alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
                return;
            }

            const statsRes = await fetch(`${API_BASE}/registrations/stats`, { headers: getHeaders() });
            if (statsRes.ok) {
                const statsData = await safeFetchJson(statsRes);
                setRegistrationStats(statsData);
            }
        } catch (err) {
            console.error('Fetch Registrations Error:', err);
        } finally {
            setLoadingRegistrations(false);
        }
    };

    const fetchPlayers = async () => {
        setLoadingPlayers(true);
        try {
            const res = await fetch(`${API_BASE}/participants`, { headers: getHeaders() });
            if (res.status === 401) { alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.'); handleLogout(); return; }
            const data = await safeFetchJson(res);
            if (res.ok && Array.isArray(data)) setPlayers(data);
            else alert(data.message || 'Failed to load players (the backend may need a redeploy).');
        } catch (err) {
            alert(`Could not load players: ${err.message}`);
        } finally {
            setLoadingPlayers(false);
        }
    };

    // Opens a player's profile (and makes sure the player list is loaded for it).
    const openPlayer = (uid) => {
        if (!players.length) fetchPlayers();
        setViewPlayerUid(uid);
    };

    const resetPlayerPassword = async (player) => {
        if (!confirm(`RESET PASSWORD for ${player.name} (${player.addovediId})? Their current password stops working and they are logged out everywhere.`)) return;
        try {
            const res = await fetch(`${API_BASE}/participants/${player._id}/reset-password`, { method: 'POST', headers: getHeaders() });
            if (res.status === 401) { alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.'); handleLogout(); return; }
            const data = await safeFetchJson(res);
            if (!res.ok) { alert(data.message || 'Failed to reset password'); return; }
            // Shown once; it is not stored anywhere readable. Give it to the player privately.
            window.prompt(`Temporary password for ${data.name} (${data.addovediId}). Copy it now and give it to the player privately. It will not be shown again.`, data.tempPassword);
        } catch (err) {
            alert(err.message);
        }
    };

    const removePlayer = async (player) => {
        if (!confirm(`REMOVE PLAYER ${player.name} (${player.addovediId}) PERMANENTLY? Their account is deleted and they will have to sign up again.`)) return;
        try {
            const res = await fetch(`${API_BASE}/participants/${player._id}`, { method: 'DELETE', headers: getHeaders() });
            if (res.status === 401) { alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.'); handleLogout(); return; }
            const data = await safeFetchJson(res);
            if (!res.ok) { alert(data.message || 'Failed to remove player'); return; }
            setViewPlayerUid(null);
            fetchPlayers();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteRegistrationRecord = async (id) => {
        if (!confirm('DELETE REGISTRATION RECORD PERMANENTLY?')) return;
        try {
            const res = await fetch(`${API_BASE}/registrations/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (res.ok) {
                fetchRegistrations();
            } else {
                alert(data.message || 'Failed to delete registration record');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Flips a registration's verification status after the admin has checked
    // it against the team's actual Unstop entry.
    const setRegistrationStatus = async (id, status) => {
        if (status === 'VERIFIED') {
            // Warn before verifying a team whose teammates haven't all accepted: once verified, teammates can no longer change their answer.
            const reg = registrations.find(r => r._id === id);
            const notAccepted = (reg?.members || []).filter(m => (m.status || 'ACCEPTED') !== 'ACCEPTED');
            if (notAccepted.length > 0) {
                const list = notAccepted.map(m => `${m.name} (${m.uid}): ${m.status === 'REJECTED' ? 'DECLINED' : m.status}`).join('\n');
                if (!window.confirm(`Not every teammate has accepted:\n\n${list}\n\nVerify this team anyway?`)) return;
            }
        }
        try {
            const res = await fetch(`${API_BASE}/registrations/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status })
            });
            const data = await safeFetchJson(res);
            if (res.ok) {
                fetchRegistrations();
            } else {
                alert(data.message || 'Failed to update registration status');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const REG_STATUS_META = {
        VERIFIED: { label: 'VERIFIED', color: '#1FFF76' },
        PENDING_UNSTOP_VERIFICATION: { label: 'PENDING', color: '#ffea00' },
        CANCELLED: { label: 'CANCELLED', color: '#ff1f4f' }
    };

    // Audit Logs fetching
    const fetchAuditLogs = async () => {
        setLoadingAuditLogs(true);
        try {
            const res = await fetch(`${API_BASE}/audit-logs?limit=150`, { headers: getHeaders() });
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (Array.isArray(data)) setAuditLogs(data);
            } else if (res.status === 401) {
                handleLogout();
                alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
            }
        } catch (err) {
            console.error('Fetch Audit Logs Error:', err);
        } finally {
            setLoadingAuditLogs(false);
        }
    };

    const clearAuditLogsRecord = async () => {
        if (!confirm('PERMANENTLY PURGE ALL SECURITY AUDIT LOGS?')) return;
        try {
            const res = await fetch(`${API_BASE}/audit-logs`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (res.ok) {
                setAuditLogs([]);
            } else {
                alert(data.message || 'Failed to purge audit logs');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setChangePwMsg({ type: '', text: '' });
        if (changePwForm.newPassword !== changePwForm.confirmPassword) {
            setChangePwMsg({ type: 'error', text: 'NEW PASSWORDS DO NOT MATCH.' });
            return;
        }
        if (changePwForm.newPassword.length < 6) {
            setChangePwMsg({ type: 'error', text: 'NEW PASSWORD MUST BE AT LEAST 6 CHARACTERS.' });
            return;
        }
        setChangePwLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/change-password`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    currentPassword: changePwForm.currentPassword,
                    newPassword: changePwForm.newPassword
                })
            });
            const data = await safeFetchJson(res);
            if (!res.ok) throw new Error(data.message || 'Failed to update password');
            setChangePwMsg({ type: 'success', text: 'PASSWORD UPDATED SUCCESSFULLY. RE-LOGIN RECOMMENDED.' });
            setChangePwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setChangePwMsg({ type: 'error', text: err.message.toUpperCase() });
        } finally {
            setChangePwLoading(false);
        }
    };

    const exportToCSV = (data, filename = 'addovedi_event_registrations.csv') => {
        if (!data || !data.length) {
            alert('No registration data available to export.');
            return;
        }
        const headers = ['Event', 'Category', 'Team Name', 'Leader Name', 'Leader UID', 'Leader Email', 'Leader Phone', 'Team Size', 'Members', 'Status', 'Unstop Ref ID', 'Registered At'];
        const csvRows = [headers.join(',')];

        data.forEach(r => {
            const membersStr = (r.members || []).map(m => `${m.name || ''} (${m.uid || ''}) [${m.status || 'ACCEPTED'}]`).join('; ');
            const row = [
                `"${r.eventTitle || ''}"`,
                `"${r.categoryTitle || ''}"`,
                `"${r.teamName || ''}"`,
                `"${r.leaderName || ''}"`,
                `"${r.leaderUID || ''}"`,
                `"${r.userEmail || ''}"`,
                `"${r.leaderPhone || ''}"`,
                r.teamSize || 1,
                `"${membersStr}"`,
                `"${r.status || ''}"`,
                `"${r.unstopRefId || ''}"`,
                `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}"`
            ];
            csvRows.push(row.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    // Opens a clean, styled print view in a new tab and triggers the browser's
    // print dialog — the admin picks "Save as PDF" there for a printable PDF,
    // with no extra PDF-generation dependency needed.
    const printRegistrations = (title, data) => {
        if (!data || !data.length) {
            alert('No registration data available to print.');
            return;
        }
        const win = window.open('', '_blank');
        if (!win) {
            alert('Please allow pop-ups for this site to print / save as PDF.');
            return;
        }
        const rowsHtml = data.map(r => `
            <tr>
                <td>${escapeHtml(r.eventTitle)}</td>
                <td>${escapeHtml(r.categoryTitle)}</td>
                <td>${escapeHtml(r.teamName)}</td>
                <td>${escapeHtml(r.leaderName)}<br/><span class="sub">${escapeHtml(r.leaderUID)}</span></td>
                <td>${escapeHtml(r.leaderPhone)}${r.userEmail ? `<br/><span class="sub">${escapeHtml(r.userEmail)}</span>` : ''}</td>
                <td>${(r.members || []).map(m => escapeHtml(`${m.name || ''} (${m.uid || ''}) [${m.status || 'ACCEPTED'}]`)).join('<br/>') || '<span class="sub">Solo</span>'}</td>
                <td>${escapeHtml((REG_STATUS_META[r.status] || REG_STATUS_META.PENDING_UNSTOP_VERIFICATION).label)}</td>
                <td>${escapeHtml(r.unstopRefId) || '<span class="sub">&mdash;</span>'}</td>
                <td class="sub">${r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
            </tr>
        `).join('');

        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${escapeHtml(title)}</title>
                <style>
                    body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 24px; }
                    h1 { font-size: 18px; margin: 0 0 4px; }
                    .meta { font-size: 11px; color: #555; margin-bottom: 16px; }
                    table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
                    th, td { border: 1px solid #ccc; padding: 6px 7px; text-align: left; vertical-align: top; }
                    th { background: #eee; }
                    .sub { color: #777; font-size: 9px; }
                    @media print { @page { size: landscape; margin: 12mm; } }
                </style>
            </head>
            <body>
                <h1>${escapeHtml(title)}</h1>
                <div class="meta">Addovedi 2026 &mdash; Generated ${new Date().toLocaleString()} &mdash; ${data.length} record(s)</div>
                <table>
                    <thead>
                        <tr>
                            <th>Event</th><th>Category</th><th>Team</th><th>Leader</th><th>Contact</th>
                            <th>Members</th><th>Status</th><th>Unstop Ref ID</th><th>Registered At</th>
                        </tr>
                    </thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </body>
            </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 350);
    };

    // Events CRUD fetching
    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const res = await fetch(`${API_BASE}/events`);
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (data.categories && data.categories.length > 0) {
                    setCategories(data.categories);
                } else {
                    setCategories(CARD_DATA);
                }
                if (data.subEvents) setSubEvents(data.subEvents);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingEvents(false);
        }
    };

    const startEditingSubEvent = (sub) => {
        const safeHeads = Array.isArray(sub.heads) && sub.heads.length > 0 ? sub.heads.map(h => ({ name: h.name || '', phone: h.phone || '' })) : [];
        while (safeHeads.length < 2) {
            safeHeads.push({ name: '', phone: '' });
        }
        const safeTimeline = { ...emptyTimeline, ...(sub.timeline || {}), day: sub.timeline?.day ?? '' };
        setEditingSubEvent({ ...sub, unstopUrl: sub.unstopUrl || 'https://unstop.com', heads: safeHeads, timeline: safeTimeline });
    };

    const cleanPayload = (data) => {
        if (!data || typeof data !== 'object') return data;
        const { _id, __v, createdAt, updatedAt, ...rest } = data;
        
        // Filter out empty coordinator objects in sub-events
        if (Array.isArray(rest.heads)) {
            rest.heads = rest.heads.filter(h => h && (h.name?.trim() || h.phone?.trim()));
        }
        
        // Filter out empty social links in crew members
        if (Array.isArray(rest.links)) {
            rest.links = rest.links.filter(l => l && (l.platform?.trim() || l.url?.trim()));
        }

        // Normalize the timeline.day select ('' means "not scheduled yet")
        // to null rather than sending an empty string into a Number field.
        if (rest.timeline && typeof rest.timeline === 'object') {
            rest.timeline = { ...rest.timeline, day: rest.timeline.day === '' ? null : Number(rest.timeline.day) };
        }

        return rest;
    };

    // The 7 main event categories are fixed and intentionally NOT editable from
    // the admin portal (only their sub-events are). See the read-only table in
    // the Events Manager tab below.

    // SubEvent create/update/delete
    const saveSubEvent = async (e) => {
        e.preventDefault();
        const payload = editingSubEvent || newSub;
        const isEdit = Boolean(editingSubEvent && editingSubEvent._id);
        const url = isEdit 
            ? `${API_BASE}/events/sub/${editingSubEvent._id}`
            : `${API_BASE}/events/sub`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(cleanPayload(payload))
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || `Failed to save sub-event configuration (HTTP ${res.status})`);
            }

            fetchEvents();
            setEditingSubEvent(null);
            setNewSub({ categoryTitle: '', title: '', subtitle: '', desc: '', overview: '', minTeam: 1, maxTeam: 5, color: '#00d9ff', xp: '1,500 XP', difficulty: 'MEDIUM', iconType: 'code', modelType: 'coding', unstopUrl: 'https://unstop.com', heads: [{ name: '', phone: '' }, { name: '', phone: '' }], timeline: { ...emptyTimeline } });
            alert('Sub-Event configuration saved successfully!');
        } catch (err) {
            alert(`Error Saving Sub-Event: ${err.message}`);
        }
    };

    const deleteSubEvent = async (id) => {
        if (!confirm('DELETE SUB-EVENT?')) return;
        try {
            const res = await fetch(`${API_BASE}/events/sub/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || 'Failed to delete sub-event');
            }
            fetchEvents();
            alert('Sub-Event deleted successfully');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    // Crew CRUD fetching
    const fetchCrew = async () => {
        setLoadingCrew(true);
        try {
            const res = await fetch(`${API_BASE}/crew`);
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (Array.isArray(data)) setCrew(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCrew(false);
        }
    };

    const saveCrew = async (e) => {
        e.preventDefault();
        const payload = editingCrew || newCrew;
        const isEdit = Boolean(editingCrew && editingCrew._id);
        const url = isEdit 
            ? `${API_BASE}/crew/${editingCrew._id}`
            : `${API_BASE}/crew`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(cleanPayload(payload))
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || `Failed to save crew profile (HTTP ${res.status})`);
            }

            fetchCrew();
            setEditingCrew(null);
            setNewCrew({ name: '', role: '', avatar: '', type: 'STUDENT', category: 'HEAD', statText: 'MISSIONS CODE', statVal: 10, featured: false, featuredHeading: '', bio: '', links: [] });
            alert('Crew member profile saved successfully!');
        } catch (err) {
            alert(`Error Saving Crew: ${err.message}`);
        }
    };

    const deleteCrew = async (id) => {
        if (!confirm('DELETE CREW MEMBER?')) return;
        try {
            const res = await fetch(`${API_BASE}/crew/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || 'Failed to delete crew member');
            }
            fetchCrew();
            alert('Crew member deleted successfully');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    // Sponsors CRUD fetching
    const fetchSponsors = async () => {
        setLoadingSponsors(true);
        try {
            const res = await fetch(`${API_BASE}/alliances`);
            if (res.ok) {
                const data = await safeFetchJson(res);
                if (Array.isArray(data)) setAlliances(data);
            }
            const catRes = await fetch(`${API_BASE}/alliances/categories`);
            if (catRes.ok) {
                const cats = await safeFetchJson(catRes);
                if (Array.isArray(cats)) setSponsorCategories(cats);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSponsors(false);
        }
    };

    const saveSponsor = async (e) => {
        e.preventDefault();
        const rawPayload = editingSponsor || newSponsor;
        const payload = {
            ...rawPayload,
            support: typeof rawPayload.support === 'string' 
                ? rawPayload.support.split(',').map(s => s.trim()).filter(Boolean)
                : rawPayload.support
        };

        const isEdit = Boolean(editingSponsor && editingSponsor._id);
        const url = isEdit 
            ? `${API_BASE}/alliances/${editingSponsor._id}`
            : `${API_BASE}/alliances`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(cleanPayload(payload))
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || `Failed to save sponsor profile (HTTP ${res.status})`);
            }

            fetchSponsors();
            setEditingSponsor(null);
            setNewSponsor({ name: '', category: 'GOLD', sub: 'Technology Sponsor', logo: 'NV', desc: '', support: '', url: '#' });
            alert('Sponsor profile saved successfully!');
        } catch (err) {
            alert(`Error Saving Sponsor: ${err.message}`);
        }
    };

    const sponsorCategoryRequest = async (path, method, body) => {
        try {
            const res = await fetch(`${API_BASE}/alliances/categories${path}`, {
                method, headers: getHeaders(), body: body ? JSON.stringify(body) : undefined
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED OR UNAUTHORIZED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return false;
                }
                throw new Error(data.message || `Request failed (HTTP ${res.status})`);
            }
            fetchSponsors();
            return true;
        } catch (err) {
            alert(`Category error: ${err.message}`);
            return false;
        }
    };

    const addSponsorCategory = async (e) => {
        e.preventDefault();
        if (!newSponsorCategory.name.trim()) return;
        if (await sponsorCategoryRequest('', 'POST', { ...newSponsorCategory, priority: Number(newSponsorCategory.priority) })) {
            setNewSponsorCategory({ name: '', priority: 3, color: '#00E5FF' });
        }
    };

    const deleteSponsor = async (id) => {
        if (!confirm('DELETE ALLIANCE SPONSOR?')) return;
        try {
            const res = await fetch(`${API_BASE}/alliances/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const data = await safeFetchJson(res);
            if (!res.ok) {
                if (res.status === 401) {
                    alert('SESSION EXPIRED. PLEASE LOG IN AGAIN.');
                    handleLogout();
                    return;
                }
                throw new Error(data.message || 'Failed to delete sponsor');
            }
            fetchSponsors();
            alert('Sponsor deleted successfully');
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    /* =========================================================================
       1. AUTHORIZATION LOGIN PORTAL (FRONTEND)
       ========================================================================= */
    if (!token) {
        return (
            <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{ position:'fixed', inset:0, background:'#05070D', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, overflowY:'auto' }}>
            <ScrollIndicator scrollRef={pageRef} />
                <style dangerouslySetInnerHTML={{ __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                    @keyframes blink { 0%,100%{opacity:0} 50%{opacity:1} }
                    @keyframes pulse { 0%,100%{box-shadow:0 0 15px rgba(0,229,255,0.25)} 50%{box-shadow:0 0 35px rgba(0,229,255,0.45)} }
                `}} />
                
                {/* Lobby grid backing */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(0,229,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div style={{
                    position: 'relative',
                    width: 'min(90vw, 420px)',
                    background: '#0D1320',
                    border: '1.5px solid rgba(0, 229, 255, 0.25)',
                    borderRadius: '12px',
                    padding: '32px 24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    animation: 'pulse 4s infinite alternate',
                    zIndex: 10
                }}>
                    {/* Header */}
                    <div style={{ borderBottom: '1px solid rgba(0,229,255,0.15)', paddingBottom: '12px', marginBottom: '24px', textAlign: 'center' }}>
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', fontWeight: 900, color: '#00E5FF', letterSpacing: '0.25em', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
                            [ HQ_ADMIN_AUTHENTICATION ]
                        </span>
                        <div style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.15em' }}>
                            SECURE UPLINK GATEWAY
                        </div>
                    </div>

                    {authError && (
                        <div style={{
                            background: 'rgba(255,31,79,0.1)',
                            border: '1px solid #ff1f4f',
                            borderRadius: '4px',
                            color: '#ff1f4f',
                            padding: '10px',
                            fontSize: '10.5px',
                            fontFamily: 'monospace',
                            marginBottom: '20px',
                            textAlign: 'center',
                            letterSpacing: '0.05em'
                        }}>
                            ERROR: {authError.toUpperCase()}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>IDENTIFIER</label>
                            <input
                                type="text"
                                required
                                placeholder="ENTER USERNAME..."
                                value={loginUser}
                                onChange={e => setLoginUser(e.target.value)}
                                style={{
                                    width: '100%', background: 'rgba(0,0,0,0.5)', border: '1.2px solid rgba(255,255,255,0.06)',
                                    borderRadius: '4px', color: '#FFF', padding: '10px 14px', fontFamily: 'monospace',
                                    fontSize: '11px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>ACCESS CODE</label>
                            <input
                                type="password"
                                required
                                placeholder="ENTER PASSWORD..."
                                value={loginPass}
                                onChange={e => setLoginPass(e.target.value)}
                                style={{
                                    width: '100%', background: 'rgba(0,0,0,0.5)', border: '1.2px solid rgba(255,255,255,0.06)',
                                    borderRadius: '4px', color: '#FFF', padding: '10px 14px', fontFamily: 'monospace',
                                    fontSize: '11px', outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={authenticating}
                            style={{
                                marginTop: '10px', width: '100%', padding: '12px 0',
                                fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 900,
                                letterSpacing: '0.25em', color: '#00E5FF', background: 'rgba(0,229,255,0.05)',
                                border: '1.5px solid #00E5FF', borderRadius: '6px', cursor: 'pointer',
                                transition: 'all 0.25s', boxShadow: '0 0 12px rgba(0,229,255,0.1)'
                            }}
                        >
                            {authenticating ? 'AUTHENTICATING LINK...' : 'AUTHORIZE CONTROL LINK'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    /* =========================================================================
       2. ADMIN HQ DASHBOARD WORKSPACE (FRONTEND)
       ========================================================================= */
    return (
        <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{ position:'fixed', inset:0, background:'#05070D', color:'#F5F7FA', zIndex:100, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <ScrollIndicator scrollRef={pageRef} />
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                .admin-tab-btn {
                    font-family: 'Orbitron', monospace;
                    font-size: 8.5px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    padding: 8px 16px;
                    border: 1px solid rgba(0,229,255,0.15);
                    background: transparent;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .admin-tab-btn:hover { color: #00E5FF; background: rgba(0,229,255,0.04); }
                .admin-tab-active { color: #00E5FF !important; border-color: #00E5FF !important; background: rgba(0,229,255,0.08) !important; }
                
                table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 11px; margin-top: 10px; }
                th { text-align: left; padding: 10px; border-bottom: 1px solid rgba(0,229,255,0.3); color: #00E5FF; letter-spacing: 0.1em; }
                td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); vertical-align: middle; }
                tr:hover td { background: rgba(255,255,255,0.02); }
                
                input, textarea, select {
                    background: rgba(0,0,0,0.5) !important;
                    border: 1.2px solid rgba(255,255,255,0.08) !important;
                    color: #fff !important;
                    padding: 8px 12px !important;
                    font-family: monospace !important;
                    font-size: 11px !important;
                    outline: none !important;
                    border-radius: 4px !important;
                }
                input:focus, textarea:focus, select:focus {
                    border-color: #00E5FF !important;
                }
            `}} />

            {/* Dashboard Header Bar */}
            <header style={{ height: '70px', borderBottom: '1px solid rgba(0,229,255,0.15)', background: '#0D1320', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1FFF76', boxShadow: '0 0 8px #1FFF76' }} />
                    <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: '0.2em', fontSize: '14px', color: '#FFF' }}>
                        ADDOVEDI HQ
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '3px' }}>
                        CONTROL CONSOLE
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '10.5px', color: 'rgba(255,255,255,0.5)' }}>
                        OPERATOR: <span style={{ color: '#00E5FF', fontWeight: 600 }}>{username.toUpperCase()}</span>
                    </span>
                    <button onClick={handleLogout} style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', fontWeight: 900, letterSpacing: '0.15em', padding: '6px 14px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}>
                        TERMINATE SESSION
                    </button>
                </div>
            </header>

            {/* Main Tabs Navigation */}
            <div style={{ background: '#080C16', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '12px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('status')} className={`admin-tab-btn${activeTab === 'status' ? ' admin-tab-active' : ''}`}>SECTOR STATUS</button>
                <button onClick={() => setActiveTab('messages')} className={`admin-tab-btn${activeTab === 'messages' ? ' admin-tab-active' : ''}`}>INBOX MESSAGES</button>
                <button onClick={() => { setActiveTab('registrations'); fetchRegistrations(); }} className={`admin-tab-btn${activeTab === 'registrations' ? ' admin-tab-active' : ''}`}>EVENT REGISTRATIONS</button>
                <button onClick={() => { setActiveTab('players'); fetchPlayers(); fetchRegistrations(); }} className={`admin-tab-btn${activeTab === 'players' ? ' admin-tab-active' : ''}`}>PLAYERS</button>
                <button onClick={() => { setActiveTab('audit'); fetchAuditLogs(); }} className={`admin-tab-btn${activeTab === 'audit' ? ' admin-tab-active' : ''}`} style={{ borderColor: activeTab === 'audit' ? '#1FFF76' : undefined, color: activeTab === 'audit' ? '#1FFF76' : undefined }}>🛡 AUDIT LOGS</button>
                <button onClick={() => setActiveTab('events')} className={`admin-tab-btn${activeTab === 'events' ? ' admin-tab-active' : ''}`}>EVENTS DATABASE</button>
                <button onClick={() => setActiveTab('crew')} className={`admin-tab-btn${activeTab === 'crew' ? ' admin-tab-active' : ''}`}>CREW PERSONNEL</button>
                <button onClick={() => setActiveTab('sponsors')} className={`admin-tab-btn${activeTab === 'sponsors' ? ' admin-tab-active' : ''}`}>SPONSOR ALLIANCES</button>
                <button onClick={() => { setActiveTab('security'); setChangePwMsg({ type: '', text: '' }); }} className={`admin-tab-btn${activeTab === 'security' ? ' admin-tab-active' : ''}`} style={{ marginLeft: 'auto', borderColor: activeTab === 'security' ? '#ff1f4f' : undefined, color: activeTab === 'security' ? '#ff1f4f' : undefined }}>⚙ SECURITY</button>
            </div>

            {/* Dashboard Workspace */}
            <main style={{ flex: 1, padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>

                {/* ── TAB 1: SECTOR STATUS OVERLAYS ── */}
                {activeTab === 'status' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            SECTOR DASHBOARD AVAILABILITY CONTROL
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                            {[
                                { title: 'General Queries', val: generalQueries, setVal: setGeneralQueries, options: ['ONLINE', 'OFFLINE'] },
                                { title: 'Sponsors', val: sponsors, setVal: setSponsors, options: ['AVAILABLE', 'BUSY', 'ONLINE'] },
                                { title: 'Events', val: events, setVal: setEvents, options: ['ONLINE', 'OFFLINE'] },
                                { title: 'Media Relations', val: media, setVal: setMedia, options: ['RESPONDING', 'BUSY', 'ONLINE'] }
                            ].map((sector, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{sector.title}</span>
                                    <select value={sector.val} onChange={e => sector.setVal(e.target.value)} style={{ width: '100%' }}>
                                        {sector.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <button onClick={saveStatusSettings} disabled={statusSaving} style={{ fontFamily: "'Orbitron', monospace", fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.2em', padding: '12px 32px', border: 'none', background: 'linear-gradient(90deg, #7A5CFF 0%, #00E5FF 100%)', color: '#FFF', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,229,255,0.2)' }}>
                            {statusSaving ? 'SAVING CHANNELS...' : 'SAVE SYSTEM STATUS'}
                        </button>
                    </div>
                )}

                {/* ── TAB 2: INBOX MESSAGE DATABASE ── */}
                {activeTab === 'messages' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', margin: 0 }}>
                                INCOMING CONTACT LOGS
                            </h3>
                            <button onClick={fetchMessages} style={{ fontFamily: 'monospace', fontSize: '9px', color: '#00E5FF', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                [ REFRESH ]
                            </button>
                        </div>

                        {loadingMessages ? (
                            <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '30px' }}>ACCESSING RECORDS...</div>
                        ) : messages.length === 0 ? (
                            <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '30px' }}>INBOX IS EMPTY · NO TRANMISSIONS IN LOGS</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SENDER</th>
                                            <th>EMAIL</th>
                                            <th>SUBJECT</th>
                                            <th>MESSAGE</th>
                                            <th>RECEIVED</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map(msg => (
                                            <tr key={msg._id}>
                                                <td style={{ fontWeight: 600 }}>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td style={{ color: '#00E5FF' }}>{msg.subject}</td>
                                                <td style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-all' }}>{msg.message}</td>
                                                <td style={{ color: 'rgba(255,255,255,0.4)' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <button onClick={() => deleteMessage(msg._id)} style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer', fontFamily: 'monospace', fontSize: '9px' }}>
                                                        PURGE
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB: EVENT REGISTRATIONS ── */}
                {activeTab === 'registrations' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <SiteToggle apiBase={API_BASE} getHeaders={getHeaders} onUnauthorized={handleLogout}
                            path="events" flag="eventsVisible" title="EVENTS SECTION" onLabel="LIVE" offLabel="HIDDEN (COMING SOON)"
                            onButton="HIDE EVENTS" offButton="SHOW EVENTS"
                            onHint="Visitors can open the Events / Arena pages and see every event."
                            offHint='The whole Events / Arena section is replaced by an "Events coming soon" page. Registrations and data are untouched.'
                            confirmOn="SHOW THE EVENTS SECTION TO EVERYONE?"
                            confirmOff='HIDE THE EVENTS SECTION? Visitors will see "Events coming soon" instead of the arena and event pages.' />
                        <SiteToggle apiBase={API_BASE} getHeaders={getHeaders} onUnauthorized={handleLogout}
                            onHint='Visitors can register for events. Turn off to show "Registration starting soon" instead.'
                            offHint='Visitors see "Registration starting soon" and the server refuses new registrations. Existing registrations are unaffected.'
                            confirmOn="OPEN EVENT REGISTRATION FOR EVERYONE?"
                            confirmOff='CLOSE EVENT REGISTRATION? The site will show "starting soon" and new registrations will be refused.' />
                        <UnstopReconcile
                            apiBase={API_BASE}
                            getHeaders={getHeaders}
                            registrations={registrations}
                            eventTitles={[...new Set([...subEvents.map(e => e.title), ...registrations.map(r => r.eventTitle)])].sort()}
                            onDone={fetchRegistrations}
                        />
                        {/* Header & KPI Summary Cards */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '12px', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#00E5FF', letterSpacing: '0.15em', margin: 0 }}>
                                    EVENT REGISTRATION CONTROL & ROSTER DIRECTORY
                                </h3>
                                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
                                    Real-time participant database, event enrollments, and roster breakdown
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => exportToCSV(registrations, 'addovedi_master_registrations.csv')}
                                    style={{ fontFamily: "'Orbitron', monospace", fontSize: '8px', fontWeight: 800, padding: '8px 14px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'rgba(0,229,255,0.06)', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    EXPORT MASTER CSV
                                </button>
                                <button
                                    onClick={() => printRegistrations('Addovedi 2026 — Master Registration List', registrations)}
                                    style={{ fontFamily: "'Orbitron', monospace", fontSize: '8px', fontWeight: 800, padding: '8px 14px', border: '1px solid #9b5cff', color: '#9b5cff', background: 'rgba(155,92,255,0.06)', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    PRINT / SAVE AS PDF
                                </button>
                                <button
                                    onClick={fetchRegistrations}
                                    style={{ fontFamily: 'monospace', fontSize: '9px', color: '#00E5FF', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                >
                                    [ REFRESH ]
                                </button>
                            </div>
                        </div>

                        {/* KPI Counter Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,229,255,0.15)', padding: '16px', borderRadius: '6px' }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>TOTAL REGISTRATIONS</div>
                                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '24px', fontWeight: 900, color: '#00E5FF', marginTop: '4px' }}>
                                    {registrations.length}
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(155,92,255,0.2)', padding: '16px', borderRadius: '6px' }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>UNIQUE PARTICIPANTS (UID)</div>
                                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '24px', fontWeight: 900, color: '#9b5cff', marginTop: '4px' }}>
                                    {registrationStats?.uniqueParticipantsCount || new Set(registrations.map(r => r.leaderUID?.toLowerCase())).size}
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(31,255,118,0.2)', padding: '16px', borderRadius: '6px' }}>
                                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>ACTIVE EVENT BREAKDOWN</div>
                                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '24px', fontWeight: 900, color: '#1FFF76', marginTop: '4px' }}>
                                    {registrationStats?.eventBreakdown?.length || new Set(registrations.map(r => r.eventTitle)).size} EVENTS
                                </div>
                            </div>
                        </div>

                        {/* View Mode Switcher & Search Bar */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => { setRegViewMode('participants'); setSelectedEventRoster(null); }}
                                    style={{
                                        fontFamily: "'Orbitron', monospace", fontSize: '8.5px', fontWeight: 700, padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                                        background: regViewMode === 'participants' ? 'rgba(0,229,255,0.15)' : 'transparent',
                                        color: regViewMode === 'participants' ? '#00E5FF' : 'rgba(255,255,255,0.4)',
                                        border: regViewMode === 'participants' ? '1px solid #00E5FF' : '1px solid rgba(255,255,255,0.08)'
                                    }}
                                >
                                    PARTICIPANT DIRECTORY & EVENT HISTORY
                                </button>
                                <button
                                    onClick={() => setRegViewMode('events')}
                                    style={{
                                        fontFamily: "'Orbitron', monospace", fontSize: '8.5px', fontWeight: 700, padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                                        background: regViewMode === 'events' ? 'rgba(0,229,255,0.15)' : 'transparent',
                                        color: regViewMode === 'events' ? '#00E5FF' : 'rgba(255,255,255,0.4)',
                                        border: regViewMode === 'events' ? '1px solid #00E5FF' : '1px solid rgba(255,255,255,0.08)'
                                    }}
                                >
                                    EVENT-WISE ROSTER BREAKDOWN
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="SEARCH BY NAME, EMAIL, UID, PHONE, TEAM, EVENT..."
                                value={regSearchTerm}
                                onChange={e => setRegSearchTerm(e.target.value)}
                                style={{ width: isMobile ? '100%' : '360px', background: 'rgba(0,0,0,0.5)', border: '1.2px solid rgba(0,229,255,0.2)', color: '#FFF', padding: '8px 12px', fontSize: '10px' }}
                            />
                        </div>

                        {loadingRegistrations ? (
                            <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>LOADING REGISTRATION RECORDS...</div>
                        ) : registrations.length === 0 ? (
                            <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px' }}>NO REGISTRATIONS RECORDED YET</div>
                        ) : regViewMode === 'participants' ? (
                            /* PARTICIPANT DIRECTORY VIEW */
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>LEADER NAME & UID</th>
                                            <th>EMAIL</th>
                                            <th>TEAM NAME & SIZE</th>
                                            <th>CONTACT PHONE</th>
                                            <th>REGISTERED EVENTS (HISTORY)</th>
                                            <th>UNSTOP VERIFICATION</th>
                                            <th>REGISTRATION DATE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            // Filter registrations by search term
                                            const filtered = registrations.filter(r => {
                                                if (!regSearchTerm) return true;
                                                const term = regSearchTerm.toLowerCase();
                                                return (
                                                    r.leaderName?.toLowerCase().includes(term) ||
                                                    r.leaderUID?.toLowerCase().includes(term) ||
                                                    r.teamName?.toLowerCase().includes(term) ||
                                                    r.leaderPhone?.includes(term) ||
                                                    r.userEmail?.toLowerCase().includes(term) ||
                                                    r.eventTitle?.toLowerCase().includes(term)
                                                );
                                            });

                                            // Build mapping of UID to all registered events
                                            const userEventsMap = {};
                                            registrations.forEach(r => {
                                                const uidKey = (r.leaderUID || 'N/A').toUpperCase();
                                                if (!userEventsMap[uidKey]) userEventsMap[uidKey] = [];
                                                userEventsMap[uidKey].push(r.eventTitle);
                                            });

                                            return filtered.map(reg => {
                                                const registeredEvents = userEventsMap[(reg.leaderUID || 'N/A').toUpperCase()] || [reg.eventTitle];
                                                return (
                                                    <tr key={reg._id}>
                                                        <td>
                                                            <div onClick={() => openPlayer(reg.leaderUID)} title="View player profile" style={{ fontWeight: 700, color: '#FFF', cursor: 'pointer', textDecoration: 'underline dotted' }}>{reg.leaderName}</div>
                                                            <div onClick={() => openPlayer(reg.leaderUID)} title="View player profile" style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#00E5FF', cursor: 'pointer' }}>UID: {reg.leaderUID}</div>
                                                        </td>
                                                        <td>
                                                            {reg.userEmail ? (
                                                                <a
                                                                    href={`mailto:${reg.userEmail}`}
                                                                    style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '10px', textDecoration: 'none', display: 'block', wordBreak: 'break-all' }}
                                                                    title={`Send email to ${reg.userEmail}`}
                                                                >
                                                                    {reg.userEmail}
                                                                </a>
                                                            ) : (
                                                                <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '9px' }}>N/A</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{reg.teamName}</div>
                                                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Size: {reg.teamSize} member(s)</div>
                                                            {reg.members && reg.members.length > 0 && (
                                                                <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                                                    Members: {reg.members.map(m => `${m.name} (${m.uid}) · ${m.status === 'REJECTED' ? 'DECLINED' : (m.status || 'ACCEPTED')}`).join(', ')}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td style={{ fontFamily: 'monospace', color: '#1FFF76' }}>
                                                            {reg.leaderPhone}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                {Array.from(new Set(registeredEvents)).map((evTitle, idx) => (
                                                                    <span key={idx} style={{
                                                                        fontSize: '8px', fontFamily: "'Orbitron', monospace", fontWeight: 700, padding: '3px 8px', borderRadius: '4px',
                                                                        background: evTitle === reg.eventTitle ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)',
                                                                        color: evTitle === reg.eventTitle ? '#00E5FF' : 'rgba(255,255,255,0.7)',
                                                                        border: evTitle === reg.eventTitle ? '1px solid rgba(0,229,255,0.4)' : '1px solid rgba(255,255,255,0.1)'
                                                                    }}>
                                                                        {evTitle}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {(() => {
                                                                const meta = REG_STATUS_META[reg.status] || REG_STATUS_META.PENDING_UNSTOP_VERIFICATION;
                                                                return (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                                                        <span style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", fontWeight: 800, padding: '3px 8px', borderRadius: '4px', color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}50` }}>
                                                                            {meta.label}
                                                                        </span>
                                                                        {reg.unstopRefId && (
                                                                            <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: 'rgba(255,255,255,0.5)' }}>
                                                                                REF: {reg.unstopRefId}
                                                                            </span>
                                                                        )}
                                                                        {reg.status !== 'VERIFIED' && reg.status !== 'CANCELLED' && (
                                                                            <button
                                                                                onClick={() => setRegistrationStatus(reg._id, 'VERIFIED')}
                                                                                style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', fontWeight: 800, padding: '3px 7px', border: '1px solid #1FFF76', color: '#1FFF76', background: 'rgba(31,255,118,0.08)', borderRadius: '3px', cursor: 'pointer' }}
                                                                            >
                                                                                ✓ MARK VERIFIED
                                                                            </button>
                                                                        )}
                                                                        {reg.status === 'VERIFIED' && (
                                                                            <button
                                                                                onClick={() => setRegistrationStatus(reg._id, 'PENDING_UNSTOP_VERIFICATION')}
                                                                                style={{ fontFamily: 'monospace', fontSize: '7.5px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', textDecoration: 'underline' }}
                                                                            >
                                                                                undo
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9.5px' }}>
                                                            {reg.createdAt ? new Date(reg.createdAt).toLocaleString() : 'N/A'}
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => deleteRegistrationRecord(reg._id)}
                                                                style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer', fontFamily: 'monospace', fontSize: '9px', borderRadius: '3px' }}
                                                            >
                                                                REMOVE
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* EVENT-WISE ROSTER BREAKDOWN VIEW */
                            <div>
                                {/* Event Cards Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                    {(() => {
                                        // Aggregate registrations by event
                                        const eventMap = {};
                                        registrations.forEach(r => {
                                            if (!eventMap[r.eventTitle]) {
                                                eventMap[r.eventTitle] = {
                                                    eventTitle: r.eventTitle,
                                                    categoryTitle: r.categoryTitle,
                                                    registrations: []
                                                };
                                            }
                                            eventMap[r.eventTitle].registrations.push(r);
                                        });

                                        const eventsList = Object.values(eventMap).filter(ev => {
                                            if (!regSearchTerm) return true;
                                            const term = regSearchTerm.toLowerCase();
                                            return ev.eventTitle.toLowerCase().includes(term) || ev.categoryTitle.toLowerCase().includes(term);
                                        });

                                        if (eventsList.length === 0) {
                                            return <div style={{ color: 'rgba(255,255,255,0.3)', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>NO EVENTS MATCHING SEARCH</div>;
                                        }

                                        return eventsList.map((evItem) => {
                                            const isSelected = selectedEventRoster?.eventTitle === evItem.eventTitle;
                                            return (
                                                <div 
                                                    key={evItem.eventTitle}
                                                    onClick={() => setSelectedEventRoster(isSelected ? null : evItem)}
                                                    style={{
                                                        background: isSelected ? 'rgba(0,229,255,0.08)' : 'rgba(0,0,0,0.3)',
                                                        border: isSelected ? '1.5px solid #00E5FF' : '1px solid rgba(255,255,255,0.08)',
                                                        padding: '16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                                                        boxShadow: isSelected ? '0 0 15px rgba(0,229,255,0.2)' : 'none'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div>
                                                            <span style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", color: '#00E5FF', letterSpacing: '0.1em' }}>
                                                                {evItem.categoryTitle}
                                                            </span>
                                                            <h4 style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', color: '#FFF', margin: '4px 0 0 0' }}>
                                                                {evItem.eventTitle}
                                                            </h4>
                                                        </div>
                                                        <span style={{
                                                            fontSize: '11px', fontFamily: "'Orbitron', monospace", fontWeight: 900,
                                                            background: '#00E5FF20', color: '#00E5FF', border: '1px solid #00E5FF50',
                                                            padding: '4px 10px', borderRadius: '12px'
                                                        }}>
                                                            {evItem.registrations.length} {evItem.registrations.length === 1 ? 'TEAM' : 'TEAMS'}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                                                            {isSelected ? '▲ HIDE ROSTER' : '▼ VIEW PARTICIPANTS'}
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    exportToCSV(evItem.registrations, `${evItem.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_roster.csv`);
                                                                }}
                                                                style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", background: 'transparent', border: '1px solid rgba(0,229,255,0.4)', color: '#00E5FF', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer' }}
                                                            >
                                                                CSV
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    printRegistrations(`${evItem.eventTitle} — Roster`, evItem.registrations);
                                                                }}
                                                                style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", background: 'transparent', border: '1px solid rgba(155,92,255,0.4)', color: '#9b5cff', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer' }}
                                                            >
                                                                PDF
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>

                                {/* Selected Event Participant Roster Drawer */}
                                {selectedEventRoster && (
                                    <div style={{ background: 'rgba(2, 12, 26, 0.95)', border: '1.5px solid #00E5FF', padding: '20px', borderRadius: '8px', marginTop: '20px', boxShadow: '0 0 25px rgba(0,229,255,0.15)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
                                            <div>
                                                <span style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", color: '#00E5FF' }}>ROSTER BREAKDOWN FOR</span>
                                                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '15px', color: '#FFF', margin: '2px 0 0 0' }}>
                                                    {selectedEventRoster.eventTitle} ({selectedEventRoster.registrations.length} REGISTERED TEAMS)
                                                </h3>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => exportToCSV(selectedEventRoster.registrations, `${selectedEventRoster.eventTitle}_roster.csv`)}
                                                    style={{ fontFamily: "'Orbitron', monospace", fontSize: '8.5px', padding: '6px 12px', background: 'rgba(0,229,255,0.15)', border: '1px solid #00E5FF', color: '#00E5FF', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    EXPORT CSV
                                                </button>
                                                <button
                                                    onClick={() => printRegistrations(`${selectedEventRoster.eventTitle} — Roster`, selectedEventRoster.registrations)}
                                                    style={{ fontFamily: "'Orbitron', monospace", fontSize: '8.5px', padding: '6px 12px', background: 'rgba(155,92,255,0.15)', border: '1px solid #9b5cff', color: '#9b5cff', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    PRINT / SAVE AS PDF
                                                </button>
                                                <button
                                                    onClick={() => setSelectedEventRoster(null)}
                                                    style={{ fontFamily: 'monospace', fontSize: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0 8px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ overflowX: 'auto' }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>TEAM NAME</th>
                                                        <th>LEADER NAME</th>
                                                        <th>LEADER UID</th>
                                                        <th>EMAIL</th>
                                                        <th>PHONE NUMBER</th>
                                                        <th>TEAM MEMBERS</th>
                                                        <th>UNSTOP VERIFICATION</th>
                                                        <th>DATE REGISTERED</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedEventRoster.registrations.map(r => (
                                                        <tr key={r._id}>
                                                            <td style={{ fontWeight: 700, color: '#FFF' }}>{r.teamName}</td>
                                                            <td style={{ color: '#00E5FF' }}>{r.leaderName}</td>
                                                            <td style={{ fontFamily: 'monospace' }}>{r.leaderUID}</td>
                                                            <td>
                                                                {r.userEmail ? (
                                                                    <a
                                                                        href={`mailto:${r.userEmail}`}
                                                                        style={{ color: '#a78bfa', fontFamily: 'monospace', fontSize: '10px', textDecoration: 'none', wordBreak: 'break-all' }}
                                                                        title={`Send email to ${r.userEmail}`}
                                                                    >
                                                                        {r.userEmail}
                                                                    </a>
                                                                ) : (
                                                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '9px' }}>N/A</span>
                                                                )}
                                                            </td>
                                                            <td style={{ color: '#1FFF76', fontFamily: 'monospace' }}>{r.leaderPhone}</td>
                                                            <td>
                                                                {r.members && r.members.length > 0 ? (
                                                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>
                                                                        {r.members.map(m => `${m.name} (${m.uid}) · ${m.status === 'REJECTED' ? 'DECLINED' : (m.status || 'ACCEPTED')}`).join(', ')}
                                                                    </div>
                                                                ) : (
                                                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Solo Participant</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {(() => {
                                                                    const meta = REG_STATUS_META[r.status] || REG_STATUS_META.PENDING_UNSTOP_VERIFICATION;
                                                                    return (
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                                                            <span style={{ fontSize: '8px', fontFamily: "'Orbitron', monospace", fontWeight: 800, padding: '3px 8px', borderRadius: '4px', color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}50` }}>
                                                                                {meta.label}
                                                                            </span>
                                                                            {r.unstopRefId && (
                                                                                <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: 'rgba(255,255,255,0.5)' }}>
                                                                                    REF: {r.unstopRefId}
                                                                                </span>
                                                                            )}
                                                                            {r.status !== 'VERIFIED' && r.status !== 'CANCELLED' && (
                                                                                <button
                                                                                    onClick={() => setRegistrationStatus(r._id, 'VERIFIED')}
                                                                                    style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', fontWeight: 800, padding: '3px 7px', border: '1px solid #1FFF76', color: '#1FFF76', background: 'rgba(31,255,118,0.08)', borderRadius: '3px', cursor: 'pointer' }}
                                                                                >
                                                                                    ✓ MARK VERIFIED
                                                                                </button>
                                                                            )}
                                                                            {r.status === 'VERIFIED' && (
                                                                                <button
                                                                                    onClick={() => setRegistrationStatus(r._id, 'PENDING_UNSTOP_VERIFICATION')}
                                                                                    style={{ fontFamily: 'monospace', fontSize: '7.5px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', textDecoration: 'underline' }}
                                                                                >
                                                                                    undo
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </td>
                                                            <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9.5px' }}>
                                                                {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB 3: EVENTS MANAGER ── */}
                {activeTab === 'events' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Categories: fixed, read-only. The 7 main divisions are permanent —
                            only their sub-events are managed from this portal. */}
                        <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '16px' }}>
                                DIVISION CATEGORIES (FIXED)
                            </h3>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
                                The 7 main categories are fixed for this fest and cannot be added, edited, or deleted from here. Manage sub-events under them below.
                            </p>

                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>TITLE</th>
                                            <th>SUBTITLE</th>
                                            <th>DIFFICULTY</th>
                                            <th>MODEL TYPE</th>
                                            <th>COLOR</th>
                                            <th>XP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(cat => (
                                            <tr key={cat._id}>
                                                <td style={{ fontWeight: 600 }}>{cat.title}</td>
                                                <td>{cat.subtitle}</td>
                                                <td>
                                                    <span style={{ color: cat.color }}>{cat.difficulty}</span>
                                                </td>
                                                <td style={{ fontFamily: 'monospace', color: '#00E5FF' }}>{cat.modelType || 'coding'}</td>
                                                <td style={{ color: cat.color }}>{cat.color}</td>
                                                <td>{cat.xp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SubEvent CRUD Section */}
                        <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                                {editingSubEvent ? 'EDIT SUB-EVENT DETAILS' : 'ADD NEW SUB-EVENT'}
                            </h3>

                            <form onSubmit={saveSubEvent} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                                <select value={editingSubEvent ? editingSubEvent.categoryTitle : newSub.categoryTitle} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, categoryTitle: e.target.value }) : setNewSub({ ...newSub, categoryTitle: e.target.value })} required>
                                    <option value="">SELECT DIVISION CATEGORY...</option>
                                    {categories.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                                </select>
                                <input type="text" placeholder="Title (e.g. BUG HUNT)" value={editingSubEvent ? editingSubEvent.title : newSub.title} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, title: e.target.value.toUpperCase() }) : setNewSub({ ...newSub, title: e.target.value.toUpperCase() })} required />
                                <input type="text" placeholder="Subtitle (e.g. GATE CIRCUITS)" value={editingSubEvent ? editingSubEvent.subtitle : newSub.subtitle} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, subtitle: e.target.value }) : setNewSub({ ...newSub, subtitle: e.target.value })} required />
                                <input type="text" placeholder="XP (e.g. 2,000 XP)" value={editingSubEvent ? editingSubEvent.xp : newSub.xp} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, xp: e.target.value }) : setNewSub({ ...newSub, xp: e.target.value })} required />
                                <input type="text" placeholder="Color Hex" value={editingSubEvent ? editingSubEvent.color : newSub.color} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, color: e.target.value }) : setNewSub({ ...newSub, color: e.target.value })} required />
                                <select value={editingSubEvent ? editingSubEvent.difficulty : newSub.difficulty} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, difficulty: e.target.value }) : setNewSub({ ...newSub, difficulty: e.target.value })}>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HARD">HARD</option>
                                    <option value="ELITE">ELITE</option>
                                </select>
                                <select value={editingSubEvent ? (editingSubEvent.modelType || 'coding') : newSub.modelType} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, modelType: e.target.value }) : setNewSub({ ...newSub, modelType: e.target.value })}>
                                    <option value="coding">Coding Terminal Model</option>
                                    <option value="mecha">Robot Mech Model</option>
                                    <option value="controller">Controller Model</option>
                                    <option value="civil">City Skyline Model</option>
                                    <option value="electrical">Transformer Grid Model</option>
                                    <option value="ai">Neural Brain Model</option>
                                    <option value="gun">Gun Model</option>
                                </select>

                                {/* Event Heads */}
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '9.5px', fontFamily: "'Orbitron', monospace", color: '#00E5FF', letterSpacing: '0.1em' }}>EVENT HEADS COORDINATORS</span>
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginTop: '10px' }}>
                                        {[0, 1].map(idx => {
                                            const nameVal = editingSubEvent ? (editingSubEvent.heads[idx]?.name || '') : (newSub.heads[idx]?.name || '');
                                            const phoneVal = editingSubEvent ? (editingSubEvent.heads[idx]?.phone || '') : (newSub.heads[idx]?.phone || '');
                                            
                                            return (
                                                <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                                                    <input type="text" placeholder={`Coordinator ${idx+1} Name`} value={nameVal} onChange={e => {
                                                        const targetObj = editingSubEvent ? editingSubEvent : newSub;
                                                        const targetSetter = editingSubEvent ? setEditingSubEvent : setNewSub;
                                                        const nextHeads = [...targetObj.heads];
                                                        nextHeads[idx] = { ...nextHeads[idx], name: e.target.value };
                                                        targetSetter({ ...targetObj, heads: nextHeads });
                                                    }} required />
                                                    <input type="text" placeholder={`Phone`} value={phoneVal} onChange={e => {
                                                        const targetObj = editingSubEvent ? editingSubEvent : newSub;
                                                        const targetSetter = editingSubEvent ? setEditingSubEvent : setNewSub;
                                                        const nextHeads = [...targetObj.heads];
                                                        nextHeads[idx] = { ...nextHeads[idx], phone: e.target.value };
                                                        targetSetter({ ...targetObj, heads: nextHeads });
                                                    }} required />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Timeline Scheduling — controls if/when this sub-event shows
                                    up on the public Timeline page. Leaving Day unset means
                                    "not decided yet", and it's simply left off the schedule. */}
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                    <span style={{ fontSize: '9.5px', fontFamily: "'Orbitron', monospace", color: '#00E5FF', letterSpacing: '0.1em' }}>TIMELINE SCHEDULING</span>
                                    {(() => {
                                        const targetObj = editingSubEvent || newSub;
                                        const targetSetter = editingSubEvent ? setEditingSubEvent : setNewSub;
                                        const t = targetObj.timeline || emptyTimeline;
                                        const setT = (patch) => targetSetter({ ...targetObj, timeline: { ...t, ...patch } });
                                        return (
                                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr 1fr', gap: '14px', marginTop: '10px' }}>
                                                <select value={t.day} onChange={e => setT({ day: e.target.value })}>
                                                    <option value="">NOT SCHEDULED</option>
                                                    <option value="1">{DAY_LABELS[1]} (FROM 5PM)</option>
                                                    <option value="2">{DAY_LABELS[2]}</option>
                                                    <option value="3">{DAY_LABELS[3]}</option>
                                                </select>
                                                <input type="text" placeholder="Start Time (24h, e.g. 13:00)" value={t.time} onChange={e => setT({ time: e.target.value })} />
                                                <input type="text" placeholder="End Time (24h, e.g. 15:00)" value={t.end} onChange={e => setT({ end: e.target.value })} />
                                                <input type="text" placeholder="Venue (e.g. Lab Alpha)" value={t.venue} onChange={e => setT({ venue: e.target.value })} />
                                                <select value={t.mode} onChange={e => setT({ mode: e.target.value })}>
                                                    <option value="Solo">SOLO</option>
                                                    <option value="Team (2)">TEAM (2)</option>
                                                    <option value="Team (3)">TEAM (3)</option>
                                                    <option value="Team (4)">TEAM (4)</option>
                                                    <option value="Team">TEAM</option>
                                                </select>
                                                <input type="text" placeholder="Prize (e.g. ₹10,000)" value={t.prize} onChange={e => setT({ prize: e.target.value })} />
                                            </div>
                                        );
                                    })()}
                                </div>

                                 <input
                                    type="url"
                                    placeholder="Unstop Registration URL (e.g. https://unstop.com/o/bgmi-addovedi)"
                                    value={editingSubEvent ? (editingSubEvent.unstopUrl || '') : newSub.unstopUrl}
                                    onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, unstopUrl: e.target.value }) : setNewSub({ ...newSub, unstopUrl: e.target.value })}
                                    style={{ gridColumn: isMobile ? 'auto' : 'span 3' }}
                                    required
                                />

                                <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} placeholder="Sub-event description..." value={editingSubEvent ? editingSubEvent.desc : newSub.desc} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, desc: e.target.value }) : setNewSub({ ...newSub, desc: e.target.value })} required />
                                <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3', minHeight: '140px' }} placeholder="Overview (long text shown on the event's Overview tab; blank lines separate paragraphs)..." value={(editingSubEvent ? editingSubEvent.overview : newSub.overview) || ''} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, overview: e.target.value }) : setNewSub({ ...newSub, overview: e.target.value })} />
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace', fontSize: '10px', color: '#9CA3AF' }}>
                                    MIN TEAM SIZE (LEADER INCLUDED)
                                    <input type="number" min="1" max="10" value={(editingSubEvent ? editingSubEvent.minTeam : newSub.minTeam) ?? 1} onChange={e => { const v = Number(e.target.value); editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, minTeam: v }) : setNewSub({ ...newSub, minTeam: v }); }} required />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace', fontSize: '10px', color: '#9CA3AF' }}>
                                    MAX TEAM SIZE (SAME AS MIN = FIXED SIZE)
                                    <input type="number" min="1" max="10" value={(editingSubEvent ? editingSubEvent.maxTeam : newSub.maxTeam) ?? 5} onChange={e => { const v = Number(e.target.value); editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, maxTeam: v }) : setNewSub({ ...newSub, maxTeam: v }); }} required />
                                </label>
                                
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ padding: '8px 24px', border: 'none', background: '#00E5FF', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>
                                        {editingSubEvent ? 'SAVE EDIT' : 'ADD SUB-EVENT'}
                                    </button>
                                    {editingSubEvent && (
                                        <button onClick={() => setEditingSubEvent(null)} style={{ padding: '8px 24px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontFamily: 'monospace', cursor: 'pointer' }}>
                                            CANCEL
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* SubEvents Table list */}
                            <div style={{ marginTop: '30px' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>DIVISION</th>
                                            <th>EVENT TITLE</th>
                                            <th>MODEL TYPE</th>
                                            <th>UNSTOP LINK</th>
                                            <th>XP</th>
                                            <th>HEADS</th>
                                            <th>SCHEDULE</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subEvents.map(sub => (
                                            <tr key={sub._id}>
                                                <td style={{ color: '#00E5FF', fontWeight: 600 }}>{sub.categoryTitle}</td>
                                                <td style={{ fontWeight: 600 }}>{sub.title}</td>
                                                <td style={{ fontFamily: 'monospace', color: '#00E5FF' }}>{sub.modelType || 'coding'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                                    <a href={sub.unstopUrl || 'https://unstop.com'} target="_blank" rel="noreferrer" style={{ color: '#00E5FF', textDecoration: 'underline' }}>
                                                        {sub.unstopUrl ? (sub.unstopUrl.length > 25 ? sub.unstopUrl.substring(0, 25) + '...' : sub.unstopUrl) : 'unstop.com'}
                                                    </a>
                                                </td>
                                                <td>{sub.xp}</td>
                                                <td>{sub.heads ? sub.heads.map(h => h.name).join(', ') : 'N/A'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                                    {sub.timeline?.day ? (
                                                        <span style={{ color: '#1FFF76' }}>{DAY_LABELS[sub.timeline.day] || `DAY ${sub.timeline.day}`} · {sub.timeline.time || '—'}</span>
                                                    ) : (
                                                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>NOT SCHEDULED</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => startEditingSubEvent(sub)} style={{ padding: '4px 10px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'transparent', cursor: 'pointer' }}>EDIT</button>
                                                        <button onClick={() => deleteSubEvent(sub._id)} style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer' }}>DELETE</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 4: CREW PERSONNEL ── */}
                {activeTab === 'crew' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <SiteToggle apiBase={API_BASE} getHeaders={getHeaders} onUnauthorized={handleLogout}
                            path="crew" flag="crewVisible" title="CREW PAGE" onLabel="LIVE" offLabel="HIDDEN (LAUNCHING SOON)"
                            onButton="HIDE CREW PAGE" offButton="SHOW CREW PAGE"
                            onHint='The Crew page is public. Hide it to show "Crew launching soon" instead.'
                            offHint='Visitors see "Crew launching soon". Turn on when the crew list is ready.'
                            confirmOn="SHOW THE CREW PAGE TO EVERYONE?"
                            confirmOff='HIDE THE CREW PAGE? Visitors will see "Crew launching soon".' />
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            {editingCrew ? 'EDIT CREW MEMBER PROFILE' : 'ADD NEW CREW PERSONNEL'}
                        </h3>

                        <form onSubmit={saveCrew} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <input type="text" placeholder="Full Name" value={editingCrew ? editingCrew.name : newCrew.name} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, name: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, name: e.target.value.toUpperCase() })} required />
                            <input type="text" placeholder="Role / Title (e.g. WEB HEAD)" value={editingCrew ? editingCrew.role : newCrew.role} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, role: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, role: e.target.value.toUpperCase() })} required />
                            <select value={(editingCrew ? editingCrew.type : newCrew.type) || 'STUDENT'} onChange={e => { const type = e.target.value; const category = type === 'FACULTY' ? 'FACULTY' : 'HEAD'; editingCrew ? setEditingCrew({ ...editingCrew, type, category }) : setNewCrew({ ...newCrew, type, category }); }}>
                                <option value="STUDENT">STUDENT HEAD</option>
                                <option value="FACULTY">FACULTY COORDINATOR</option>
                            </select>
                            <select style={{ display: ((editingCrew ? editingCrew.type : newCrew.type) || 'STUDENT') === 'FACULTY' ? 'none' : undefined }} value={editingCrew ? editingCrew.category : newCrew.category} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, category: e.target.value }) : setNewCrew({ ...newCrew, category: e.target.value })}>
                                <option value="HEAD">HEAD</option>
                                <option value="CREATIVE & TECH">CREATIVE & TECH</option>
                                <option value="OUTREACH & FINANCE">OUTREACH & FINANCE</option>
                                <option value="OPERATIONS">OPERATIONS</option>
                                {/* keep a legacy/unknown category selectable so editing an old member doesn't silently change it */}
                                {(() => { const cur = editingCrew ? editingCrew.category : newCrew.category; return cur && !['HEAD', 'CREATIVE & TECH', 'OUTREACH & FINANCE', 'OPERATIONS'].includes(cur) ? <option value={cur}>{cur}</option> : null; })()}
                            </select>
                            <input type="text" placeholder="Statistics Metric Label" value={editingCrew ? editingCrew.statText : newCrew.statText} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, statText: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, statText: e.target.value.toUpperCase() })} required />
                            <input type="number" placeholder="Statistics Metric Value" value={editingCrew ? editingCrew.statVal : newCrew.statVal} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, statVal: parseInt(e.target.value) || 0 }) : setNewCrew({ ...newCrew, statVal: parseInt(e.target.value) || 0 })} required />
                            <select value={editingCrew ? (editingCrew.featured ? 'yes' : 'no') : (newCrew.featured ? 'yes' : 'no')} onChange={e => {
                                const isFeat = e.target.value === 'yes';
                                editingCrew ? setEditingCrew({ ...editingCrew, featured: isFeat }) : setNewCrew({ ...newCrew, featured: isFeat });
                            }}>
                                <option value="no">NOT FEATURED</option>
                                <option value="yes">FEATURED PROFILE</option>
                            </select>
                            
                            <input style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} type="text" placeholder="Featured Heading (e.g. INTERFACE LEAD)" value={editingCrew ? editingCrew.featuredHeading : newCrew.featuredHeading} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, featuredHeading: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, featuredHeading: e.target.value.toUpperCase() })} />
                            <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} placeholder="Personnel bio..." value={editingCrew ? editingCrew.bio : newCrew.bio} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, bio: e.target.value }) : setNewCrew({ ...newCrew, bio: e.target.value })} />

                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                <span style={{ fontSize: '9.5px', fontFamily: "'Orbitron', monospace", color: '#00E5FF', letterSpacing: '0.15em' }}>AVATAR PORTRAIT IMAGE (CLOUDINARY)</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {(editingCrew ? editingCrew.avatar : newCrew.avatar) ? (
                                            <img src={editingCrew ? editingCrew.avatar : newCrew.avatar} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '18px' }}>👤</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageUpload(e, 'crew')}
                                            style={{ fontSize: '10px', color: '#00E5FF' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="OR PASTE AVATAR IMAGE URL DIRECTLY..."
                                            value={editingCrew ? editingCrew.avatar : newCrew.avatar}
                                            onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, avatar: e.target.value }) : setNewCrew({ ...newCrew, avatar: e.target.value })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ padding: '8px 24px', border: 'none', background: '#00E5FF', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>
                                    {editingCrew ? 'SAVE EDIT' : 'ADD PERSONNEL'}
                                </button>
                                {editingCrew && (
                                    <button onClick={() => setEditingCrew(null)} style={{ padding: '8px 24px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontFamily: 'monospace', cursor: 'pointer' }}>
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Crew list table */}
                        <div style={{ marginTop: '30px' }}>
                            {loadingCrew ? (
                                <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>SYNCING DATABASE...</div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>NAME</th>
                                            <th>ROLE</th>
                                            <th>DIVISION</th>
                                            <th>FEATURED</th>
                                            <th>STAT METRIC</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {crew.map(member => (
                                            <tr key={member._id}>
                                                <td style={{ fontWeight: 600 }}>{member.name}</td>
                                                <td>{member.role}</td>
                                                <td>{member.type === 'FACULTY' ? 'FACULTY' : member.category}</td>
                                                <td style={{ color: member.featured ? '#1FFF76' : 'rgba(255,255,255,0.3)' }}>{member.featured ? 'FEATURED' : 'NO'}</td>
                                                <td>{member.statVal} {member.statText}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setEditingCrew(member)} style={{ padding: '4px 10px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'transparent', cursor: 'pointer' }}>EDIT</button>
                                                        <button onClick={() => deleteCrew(member._id)} style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer' }}>DELETE</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB 5: SPONSOR ALLIANCES ── */}
                {activeTab === 'sponsors' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>SPONSOR CATEGORIES &amp; PRIORITY</h3>
                        <p style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#9CA3AF', marginBottom: '14px', lineHeight: 1.6 }}>
                            Priority 1 = biggest cards, shown first on the Partners page. Priority 5 = smallest cards, shown last. Categories with the same priority keep the order they were created in.
                        </p>
                        <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                            {sponsorCategories.map(c => (
                                <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: '6px' }}>
                                    <input type="color" value={c.color || '#00E5FF'} onChange={e => sponsorCategoryRequest(`/${c._id}`, 'PUT', { color: e.target.value })} style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'none' }} />
                                    <span style={{ fontFamily: 'monospace', fontWeight: 900, color: c.color || '#fff', flex: '1 1 120px' }}>{c.name}</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#6B7280' }}>{alliances.filter(a => a.category === c.name).length} sponsor(s)</span>
                                    <select value={c.priority} onChange={e => sponsorCategoryRequest(`/${c._id}`, 'PUT', { priority: Number(e.target.value) })}>
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>PRIORITY {n}{n === 1 ? ' (LARGEST)' : n === 5 ? ' (SMALLEST)' : ''}</option>)}
                                    </select>
                                    <button type="button" onClick={() => { if (confirm(`DELETE CATEGORY ${c.name}?`)) sponsorCategoryRequest(`/${c._id}`, 'DELETE'); }} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', fontFamily: 'monospace', fontSize: '10px', padding: '4px 10px', cursor: 'pointer' }}>DELETE</button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={addSponsorCategory} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                            <input type="text" placeholder="New category name (e.g. PRESENTING PARTNER)" value={newSponsorCategory.name} onChange={e => setNewSponsorCategory({ ...newSponsorCategory, name: e.target.value })} maxLength={40} required style={{ flex: '1 1 220px' }} />
                            <select value={newSponsorCategory.priority} onChange={e => setNewSponsorCategory({ ...newSponsorCategory, priority: e.target.value })}>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>PRIORITY {n}{n === 1 ? ' (LARGEST)' : n === 5 ? ' (SMALLEST)' : ''}</option>)}
                            </select>
                            <input type="color" value={newSponsorCategory.color} onChange={e => setNewSponsorCategory({ ...newSponsorCategory, color: e.target.value })} style={{ width: '36px', height: '32px', padding: 0, border: 'none', background: 'none' }} />
                            <button type="submit" style={{ padding: '8px 20px', border: 'none', background: '#00E5FF', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>ADD CATEGORY</button>
                        </form>

                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            {editingSponsor ? 'EDIT ALLIANCE SPONSOR' : 'ADD NEW SPONSOR ALLIANCE'}
                        </h3>

                        <form onSubmit={saveSponsor} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <input type="text" placeholder="Company Name" value={editingSponsor ? editingSponsor.name : newSponsor.name} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, name: e.target.value }) : setNewSponsor({ ...newSponsor, name: e.target.value })} required />
                            <select value={editingSponsor ? editingSponsor.category : newSponsor.category} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, category: e.target.value }) : setNewSponsor({ ...newSponsor, category: e.target.value })}>
                                {(sponsorCategories.length ? sponsorCategories : [{ name: 'PLATINUM', priority: 1 }, { name: 'GOLD', priority: 2 }, { name: 'SILVER', priority: 3 }, { name: 'TECHNICAL', priority: 4 }, { name: 'EVENT', priority: 4 }, { name: 'TRAVEL', priority: 4 }, { name: 'MEDIA', priority: 5 }, { name: 'BARTER', priority: 5 }]).map(c => <option key={c._id || c.name} value={c.name}>{c.name} ({c.priority})</option>)}
                                {(editingSponsor ? editingSponsor.category : newSponsor.category) && !sponsorCategories.some(c => c.name === (editingSponsor ? editingSponsor.category : newSponsor.category)) && <option value={editingSponsor ? editingSponsor.category : newSponsor.category}>{editingSponsor ? editingSponsor.category : newSponsor.category}</option>}
                            </select>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#9CA3AF' }}>
                                <input type="checkbox" checked={!!(editingSponsor ? editingSponsor.pending : newSponsor.pending)} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, pending: e.target.checked }) : setNewSponsor({ ...newSponsor, pending: e.target.checked })} />
                                NOT FINALIZED (SHOW "JOINING SOON")
                            </label>
                            <input type="text" placeholder="Partnership Sub (e.g. Technology Partner)" value={editingSponsor ? editingSponsor.sub : newSponsor.sub} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, sub: e.target.value }) : setNewSponsor({ ...newSponsor, sub: e.target.value })} required />
                            <input type="text" placeholder="Logo Initials (e.g. NV) — used if no image uploaded" value={editingSponsor ? editingSponsor.logo : newSponsor.logo} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, logo: e.target.value.toUpperCase() }) : setNewSponsor({ ...newSponsor, logo: e.target.value.toUpperCase() })} />
                            <input type="text" placeholder="Website URL" value={editingSponsor ? editingSponsor.url : newSponsor.url} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, url: e.target.value }) : setNewSponsor({ ...newSponsor, url: e.target.value })} required />
                            <input type="text" placeholder="Support Fields (comma-separated, e.g. AI, Servers)" value={editingSponsor ? (Array.isArray(editingSponsor.support) ? editingSponsor.support.join(', ') : editingSponsor.support) : newSponsor.support} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, support: e.target.value }) : setNewSponsor({ ...newSponsor, support: e.target.value })} required />
                            <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} placeholder="Partnership brief description..." value={editingSponsor ? editingSponsor.desc : newSponsor.desc} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, desc: e.target.value }) : setNewSponsor({ ...newSponsor, desc: e.target.value })} required />

                            {/* ── Sponsor Logo Image Upload ── */}
                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                <span style={{ fontSize: '9.5px', fontFamily: "'Orbitron', monospace", color: '#00E5FF', letterSpacing: '0.15em' }}>SPONSOR LOGO IMAGE (CLOUDINARY) — OPTIONAL</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {(editingSponsor ? editingSponsor.logoImage : newSponsor.logoImage) ? (
                                            <img src={editingSponsor ? editingSponsor.logoImage : newSponsor.logoImage} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                        ) : (
                                            <span style={{ fontSize: '20px' }}>🏢</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageUpload(e, 'sponsor')}
                                            style={{ fontSize: '10px', color: '#00E5FF' }}
                                        />
                                        {uploadingImage && (
                                            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#1FFF76' }}>⟳ UPLOADING TO CLOUDINARY...</span>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="OR PASTE LOGO IMAGE URL DIRECTLY..."
                                            value={editingSponsor ? (editingSponsor.logoImage || '') : (newSponsor.logoImage || '')}
                                            onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, logoImage: e.target.value }) : setNewSponsor({ ...newSponsor, logoImage: e.target.value })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ padding: '8px 24px', border: 'none', background: '#00E5FF', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>
                                    {editingSponsor ? 'SAVE EDIT' : 'ADD SPONSOR'}
                                </button>
                                {editingSponsor && (
                                    <button onClick={() => setEditingSponsor(null)} style={{ padding: '8px 24px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontFamily: 'monospace', cursor: 'pointer' }}>
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Sponsors Table list */}
                        <div style={{ marginTop: '30px' }}>
                            {loadingSponsors ? (
                                <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>SYNCING SPONSORS...</div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>NAME</th>
                                            <th>CATEGORY</th>
                                            <th>INITIALS</th>
                                            <th>SUPPORT SEGMENTS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alliances.map(s => (
                                            <tr key={s._id}>
                                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                                <td style={{ color: '#00E5FF' }}>{s.category}</td>
                                                <td>{s.logo}</td>
                                                <td>{Array.isArray(s.support) ? s.support.join(', ') : s.support}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setEditingSponsor(s)} style={{ padding: '4px 10px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'transparent', cursor: 'pointer' }}>EDIT</button>
                                                        <button onClick={() => deleteSponsor(s._id)} style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer' }}>DELETE</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB: SECURITY — CHANGE PASSWORD ── */}
                {activeTab === 'security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '540px' }}>
                        <div style={{ background: '#0D1320', padding: '28px', borderRadius: '8px', border: '1px solid rgba(255,31,79,0.25)', boxShadow: '0 0 20px rgba(255,31,79,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,31,79,0.15)', paddingBottom: '14px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,31,79,0.1)', border: '1px solid rgba(255,31,79,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔒</div>
                                <div>
                                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '13px', fontWeight: 900, color: '#ff1f4f', letterSpacing: '0.15em' }}>CHANGE ADMIN PASSWORD</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>OPERATOR: {username.toUpperCase()} · SECURITY PROTOCOL</div>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        value={changePwForm.currentPassword}
                                        onChange={e => setChangePwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>New Password <span style={{ color: 'rgba(255,255,255,0.2)' }}>(min. 6 characters)</span></label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={changePwForm.newPassword}
                                        onChange={e => setChangePwForm(f => ({ ...f, newPassword: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Re-enter new password"
                                        value={changePwForm.confirmPassword}
                                        onChange={e => setChangePwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                        required
                                        style={{ borderColor: changePwForm.confirmPassword && changePwForm.confirmPassword !== changePwForm.newPassword ? '#ff1f4f' : undefined }}
                                    />
                                    {changePwForm.confirmPassword && changePwForm.confirmPassword !== changePwForm.newPassword && (
                                        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#ff1f4f' }}>Passwords do not match</span>
                                    )}
                                </div>

                                {changePwMsg.text && (
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace',
                                        fontSize: '9.5px',
                                        letterSpacing: '0.08em',
                                        background: changePwMsg.type === 'success' ? 'rgba(31,255,118,0.06)' : 'rgba(255,31,79,0.08)',
                                        border: `1px solid ${changePwMsg.type === 'success' ? 'rgba(31,255,118,0.3)' : 'rgba(255,31,79,0.3)'}`,
                                        color: changePwMsg.type === 'success' ? '#1FFF76' : '#ff1f4f',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        <span>{changePwMsg.type === 'success' ? '✓' : '✗'}</span>
                                        <span>{changePwMsg.text}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={changePwLoading}
                                    style={{
                                        fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em',
                                        padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: changePwLoading ? 'not-allowed' : 'pointer',
                                        background: changePwLoading ? 'rgba(255,31,79,0.3)' : 'linear-gradient(90deg, #c0132a 0%, #ff1f4f 100%)',
                                        color: '#FFF', marginTop: '4px',
                                        boxShadow: changePwLoading ? 'none' : '0 4px 14px rgba(255,31,79,0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {changePwLoading ? 'UPDATING CREDENTIALS...' : 'CONFIRM PASSWORD UPDATE'}
                                </button>
                            </form>
                        </div>

                        {/* Info box */}
                        <div style={{ padding: '14px 18px', borderRadius: '6px', background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.12)', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>
                            <span style={{ color: '#00E5FF', fontWeight: 700 }}>⚡ SECURITY NOTE:</span> After changing your password, your current session token will remain valid for its remaining duration (12 hours). For maximum security, terminate your current session and re-authenticate with the new credentials.
                        </div>
                    </div>
                )}

                {/* ── TAB: SECURITY AUDIT & IP LOGS ── */}
                {activeTab === 'players' && (
                    <PlayersPanel players={players} loading={loadingPlayers} registrations={registrations} onOpen={openPlayer} onDelete={removePlayer} onRefresh={() => { fetchPlayers(); fetchRegistrations(); }} />
                )}

                <PlayerProfileModal
                    player={viewPlayerUid ? players.find(p => (p.addovediId || '').toLowerCase() === viewPlayerUid.toLowerCase()) : null}
                    registrations={registrations}
                    onClose={() => setViewPlayerUid(null)}
                    onDelete={removePlayer}
                    onResetPassword={resetPlayerPassword}
                />

                {activeTab === 'audit' && (
                    <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(31,255,118,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(31,255,118,0.15)', paddingBottom: '12px', marginBottom: '24px' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: '#1FFF76', letterSpacing: '0.15em', margin: 0 }}>
                                    🛡 REAL-TIME SECURITY AUDIT & ACCESS LOGS
                                </h3>
                                <div style={{ fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                                    TRACKING LOGINS, IP ADDRESSES & EVENT MODIFICATIONS
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={fetchAuditLogs} style={{ fontFamily: 'monospace', fontSize: '9.5px', padding: '6px 14px', background: 'rgba(0,229,255,0.08)', border: '1px solid #00E5FF', color: '#00E5FF', borderRadius: '4px', cursor: 'pointer' }}>
                                    REFRESH LOGS
                                </button>
                                <button onClick={clearAuditLogsRecord} style={{ fontFamily: 'monospace', fontSize: '9.5px', padding: '6px 14px', background: 'rgba(255,31,79,0.08)', border: '1px solid #ff1f4f', color: '#ff1f4f', borderRadius: '4px', cursor: 'pointer' }}>
                                    CLEAR HISTORY
                                </button>
                            </div>
                        </div>

                        {loadingAuditLogs ? (
                            <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'monospace', color: '#1FFF76' }}>FETCHING REAL-TIME AUDIT RECORDS...</div>
                        ) : auditLogs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>NO AUDIT LOGS RECORDED YET. ALL LOGIN & EDIT ACTIONS WILL BE LOGGED HERE IN REAL TIME.</div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>TIMESTAMP (IST)</th>
                                            <th>ACTION</th>
                                            <th>OPERATOR</th>
                                            <th>IP ADDRESS</th>
                                            <th>STATUS</th>
                                            <th>MODIFICATION DETAILS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map((log) => (
                                            <tr key={log._id}>
                                                <td style={{ whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.6)' }}>
                                                    {new Date(log.createdAt || log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        padding: '3px 8px', borderRadius: '3px', fontWeight: 700, fontSize: '9.5px',
                                                        background: log.action.includes('FAIL') ? 'rgba(255,31,79,0.15)' : 'rgba(0,229,255,0.15)',
                                                        color: log.action.includes('FAIL') ? '#ff1f4f' : '#00E5FF',
                                                        border: `1px solid ${log.action.includes('FAIL') ? 'rgba(255,31,79,0.3)' : 'rgba(0,229,255,0.3)'}`
                                                    }}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: 600, color: '#FFF' }}>{log.username || 'Admin'}</td>
                                                <td style={{ color: '#1FFF76', fontFamily: 'monospace', fontWeight: 700 }}>{log.ipAddress || 'unknown'}</td>
                                                <td>
                                                    <span style={{ color: log.status === 'SUCCESS' ? '#1FFF76' : '#ff1f4f', fontWeight: 700 }}>
                                                        {log.status === 'SUCCESS' ? '✓ SUCCESS' : '✗ FAILED'}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', maxWidth: '350px', wordBreak: 'break-word' }}>
                                                    {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );

}
