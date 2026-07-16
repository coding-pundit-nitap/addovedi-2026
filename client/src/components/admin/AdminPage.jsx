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

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = window.location.origin.includes('localhost:5173')
    ? 'http://localhost:5001/api'
    : '/api';

export default function AdminPage() {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isMobile = windowWidth < 768;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    const [categories, setCategories] = useState([]);
    const [subEvents, setSubEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Crew Database state
    const [crew, setCrew] = useState([]);
    const [loadingCrew, setLoadingCrew] = useState(false);

    // Sponsors state
    const [alliances, setAlliances] = useState([]);
    const [loadingSponsors, setLoadingSponsors] = useState(false);

    // CRUD Forms states
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubEvent, setEditingSubEvent] = useState(null);
    const [editingCrew, setEditingCrew] = useState(null);
    const [editingSponsor, setEditingSponsor] = useState(null);

    // New Data Add states
    const [newCat, setNewCat] = useState({ title: '', subtitle: '', desc: '', color: '#00d9ff', xp: '5,000 XP', difficulty: 'HARD', iconType: 'code' });
    const [newSub, setNewSub] = useState({ categoryTitle: '', title: '', subtitle: '', desc: '', color: '#00d9ff', xp: '1,500 XP', difficulty: 'MEDIUM', iconType: 'code', heads: [{ name: '', phone: '' }, { name: '', phone: '' }] });
    const [newCrew, setNewCrew] = useState({ name: '', role: '', avatar: '', category: 'CORE', statText: 'MISSIONS CODE', statVal: 10, featured: false, featuredHeading: '', bio: '', links: [] });
    const [newSponsor, setNewSponsor] = useState({ name: '', category: 'GOLD', sub: 'Technology Sponsor', logo: 'NV', logoImage: '', desc: '', support: '', url: '#' });

    const [uploadingImage, setUploadingImage] = useState(false);

    // Auto-fetch data on token auth state
    useEffect(() => {
        if (token) {
            fetchStatusSettings();
            fetchMessages();
            fetchEvents();
            fetchCrew();
            fetchSponsors();
        }
    }, [token]);

    /* =========================================================================
       API SERVICES / FETCH CALLS
       ========================================================================= */
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

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
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');
            
            if (type === 'crew') {
                if (editingCrew) setEditingCrew({ ...editingCrew, avatar: data.url });
                else setNewCrew({ ...newCrew, avatar: data.url });
            } else if (type === 'sponsor') {
                if (editingSponsor) setEditingSponsor({ ...editingSponsor, logoImage: data.url });
                else setNewSponsor({ ...newSponsor, logoImage: data.url });
            }
            alert('Image uploaded successfully to Cloudinary');
        } catch (err) {
            alert(`Upload Error: ${err.message}`);
        } finally {
            setUploadingImage(false);
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
            const data = await res.json();
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
                const data = await res.json();
                setGeneralQueries(data.generalQueries);
                setSponsors(data.sponsors);
                setEvents(data.events);
                setMedia(data.media);
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
            if (res.ok) alert('SYSTEM STATUS RE-CONFIGURED');
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setStatusSaving(false);
        }
    };

    // Messages Inbox fetching
    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`${API_BASE}/messages`, { headers: getHeaders() });
            if (res.ok) setMessages(await res.json());
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
            if (res.ok) {
                setMessages(prev => prev.filter(m => m._id !== id));
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Events CRUD fetching
    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const res = await fetch(`${API_BASE}/events`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories);
                setSubEvents(data.subEvents);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingEvents(false);
        }
    };

    // Category create/update/delete
    const saveCategory = async (e) => {
        e.preventDefault();
        const payload = editingCategory || newCat;
        const url = editingCategory 
            ? `${API_BASE}/events/category/${editingCategory._id}`
            : `${API_BASE}/events/category`;
        const method = editingCategory ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchEvents();
                setEditingCategory(null);
                setNewCat({ title: '', subtitle: '', desc: '', color: '#00d9ff', xp: '5,000 XP', difficulty: 'HARD', iconType: 'code' });
                alert('Category configuration saved');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm('DELETE CATEGORY? ALL CORRESPONDING SUB-EVENTS WILL BE CASCADED DELETED.')) return;
        try {
            const res = await fetch(`${API_BASE}/events/category/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) fetchEvents();
        } catch (err) {
            alert(err.message);
        }
    };

    // SubEvent create/update/delete
    const saveSubEvent = async (e) => {
        e.preventDefault();
        const payload = editingSubEvent || newSub;
        const url = editingSubEvent 
            ? `${API_BASE}/events/sub/${editingSubEvent._id}`
            : `${API_BASE}/events/sub`;
        const method = editingSubEvent ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchEvents();
                setEditingSubEvent(null);
                setNewSub({ categoryTitle: '', title: '', subtitle: '', desc: '', color: '#00d9ff', xp: '1,500 XP', difficulty: 'MEDIUM', iconType: 'code', heads: [{ name: '', phone: '' }, { name: '', phone: '' }] });
                alert('Sub-Event configuration saved');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteSubEvent = async (id) => {
        if (!confirm('DELETE SUB-EVENT?')) return;
        try {
            const res = await fetch(`${API_BASE}/events/sub/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) fetchEvents();
        } catch (err) {
            alert(err.message);
        }
    };

    // Crew CRUD fetching
    const fetchCrew = async () => {
        setLoadingCrew(true);
        try {
            const res = await fetch(`${API_BASE}/crew`);
            if (res.ok) setCrew(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCrew(false);
        }
    };

    const saveCrew = async (e) => {
        e.preventDefault();
        const payload = editingCrew || newCrew;
        const url = editingCrew 
            ? `${API_BASE}/crew/${editingCrew._id}`
            : `${API_BASE}/crew`;
        const method = editingCrew ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchCrew();
                setEditingCrew(null);
                setNewCrew({ name: '', role: '', avatar: '', category: 'CORE', statText: 'MISSIONS CODE', statVal: 10, featured: false, featuredHeading: '', bio: '', links: [] });
                alert('Crew member profile saved');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteCrew = async (id) => {
        if (!confirm('DELETE CREW MEMBER?')) return;
        try {
            const res = await fetch(`${API_BASE}/crew/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) fetchCrew();
        } catch (err) {
            alert(err.message);
        }
    };

    // Sponsors CRUD fetching
    const fetchSponsors = async () => {
        setLoadingSponsors(true);
        try {
            const res = await fetch(`${API_BASE}/alliances`);
            if (res.ok) setAlliances(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSponsors(false);
        }
    };

    const saveSponsor = async (e) => {
        e.preventDefault();
        const rawPayload = editingSponsor || newSponsor;
        // Parse support string into array
        const payload = {
            ...rawPayload,
            support: typeof rawPayload.support === 'string' 
                ? rawPayload.support.split(',').map(s => s.trim()).filter(Boolean)
                : rawPayload.support
        };

        const url = editingSponsor 
            ? `${API_BASE}/alliances/${editingSponsor._id}`
            : `${API_BASE}/alliances`;
        const method = editingSponsor ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchSponsors();
                setEditingSponsor(null);
                setNewSponsor({ name: '', category: 'GOLD', sub: 'Technology Sponsor', logo: 'NV', desc: '', support: '', url: '#' });
                alert('Sponsor profile saved');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteSponsor = async (id) => {
        if (!confirm('DELETE ALLIANCE SPONSOR?')) return;
        try {
            const res = await fetch(`${API_BASE}/alliances/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) fetchSponsors();
        } catch (err) {
            alert(err.message);
        }
    };

    /* =========================================================================
       1. AUTHORIZATION LOGIN PORTAL (FRONTEND)
       ========================================================================= */
    if (!token) {
        return (
            <div style={{ position:'fixed', inset:0, background:'#05070D', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, overflowY:'auto' }}>
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
        <div style={{ position:'fixed', inset:0, background:'#05070D', color:'#F5F7FA', zIndex:100, display:'flex', flexDirection:'column', overflowY:'auto' }}>
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
                <button onClick={() => setActiveTab('events')} className={`admin-tab-btn${activeTab === 'events' ? ' admin-tab-active' : ''}`}>EVENTS DATABASE</button>
                <button onClick={() => setActiveTab('crew')} className={`admin-tab-btn${activeTab === 'crew' ? ' admin-tab-active' : ''}`}>CREW PERSONNEL</button>
                <button onClick={() => setActiveTab('sponsors')} className={`admin-tab-btn${activeTab === 'sponsors' ? ' admin-tab-active' : ''}`}>SPONSOR ALLIANCES</button>
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
                            <div style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '30px' }}>INBOX IS EMPTY // NO TRANMISSIONS IN LOGS</div>
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

                {/* ── TAB 3: EVENTS MANAGER ── */}
                {activeTab === 'events' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Category CRUD Section */}
                        <div style={{ background: '#0D1320', padding: '24px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                                {editingCategory ? 'EDIT DIVISION CATEGORY' : 'ADD NEW DIVISION CATEGORY'}
                            </h3>

                            <form onSubmit={saveCategory} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                                <input type="text" placeholder="Title (e.g. CODING QUEST)" value={editingCategory ? editingCategory.title : newCat.title} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, title: e.target.value.toUpperCase() }) : setNewCat({ ...newCat, title: e.target.value.toUpperCase() })} required />
                                <input type="text" placeholder="Subtitle" value={editingCategory ? editingCategory.subtitle : newCat.subtitle} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, subtitle: e.target.value }) : setNewCat({ ...newCat, subtitle: e.target.value })} required />
                                <input type="text" placeholder="XP Yield (e.g. 5,000 XP)" value={editingCategory ? editingCategory.xp : newCat.xp} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, xp: e.target.value }) : setNewCat({ ...newCat, xp: e.target.value })} required />
                                <input type="text" placeholder="Color Hex (e.g. #ff1f4f)" value={editingCategory ? editingCategory.color : newCat.color} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, color: e.target.value }) : setNewCat({ ...newCat, color: e.target.value })} required />
                                <select value={editingCategory ? editingCategory.difficulty : newCat.difficulty} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, difficulty: e.target.value }) : setNewCat({ ...newCat, difficulty: e.target.value })}>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HARD">HARD</option>
                                    <option value="ELITE">ELITE</option>
                                </select>
                                <select value={editingCategory ? editingCategory.iconType : newCat.iconType} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, iconType: e.target.value }) : setNewCat({ ...newCat, iconType: e.target.value })}>
                                    <option value="code">Code Terminal Icon</option>
                                    <option value="robot">Robot Mech Icon</option>
                                    <option value="bolt">Lightning Bolt Icon</option>
                                    <option value="gamepad">Gamepad Icon</option>
                                </select>
                                <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} placeholder="Category description..." value={editingCategory ? editingCategory.desc : newCat.desc} onChange={e => editingCategory ? setEditingCategory({ ...editingCategory, desc: e.target.value }) : setNewCat({ ...newCat, desc: e.target.value })} required />
                                
                                <div style={{ gridColumn: isMobile ? 'auto' : 'span 3', display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ padding: '8px 24px', border: 'none', background: '#00E5FF', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>
                                        {editingCategory ? 'SAVE EDIT' : 'ADD CATEGORY'}
                                    </button>
                                    {editingCategory && (
                                        <button onClick={() => setEditingCategory(null)} style={{ padding: '8px 24px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontFamily: 'monospace', cursor: 'pointer' }}>
                                            CANCEL
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Categories Table list */}
                            <div style={{ marginTop: '30px' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>TITLE</th>
                                            <th>SUBTITLE</th>
                                            <th>DIFFICULTY</th>
                                            <th>COLOR</th>
                                            <th>XP</th>
                                            <th>ACTIONS</th>
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
                                                <td style={{ color: cat.color }}>{cat.color}</td>
                                                <td>{cat.xp}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setEditingCategory(cat)} style={{ padding: '4px 10px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'transparent', cursor: 'pointer' }}>EDIT</button>
                                                        <button onClick={() => deleteCategory(cat._id)} style={{ padding: '4px 10px', border: '1px solid #ff1f4f', color: '#ff1f4f', background: 'transparent', cursor: 'pointer' }}>DELETE</button>
                                                    </div>
                                                </td>
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

                                <textarea style={{ gridColumn: isMobile ? 'auto' : 'span 3' }} placeholder="Sub-event description..." value={editingSubEvent ? editingSubEvent.desc : newSub.desc} onChange={e => editingSubEvent ? setEditingSubEvent({ ...editingSubEvent, desc: e.target.value }) : setNewSub({ ...newSub, desc: e.target.value })} required />
                                
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
                                            <th>XP</th>
                                            <th>HEADS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subEvents.map(sub => (
                                            <tr key={sub._id}>
                                                <td style={{ color: 'rgba(255,255,255,0.4)' }}>{sub.categoryTitle}</td>
                                                <td style={{ fontWeight: 600, color: sub.color }}>{sub.title}</td>
                                                <td>{sub.xp}</td>
                                                <td>{sub.heads.map(h => `${h.name} (${h.phone})`).join(', ')}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => setEditingSubEvent(sub)} style={{ padding: '4px 10px', border: '1px solid #00E5FF', color: '#00E5FF', background: 'transparent', cursor: 'pointer' }}>EDIT</button>
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
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            {editingCrew ? 'EDIT CREW MEMBER PROFILE' : 'ADD NEW CREW PERSONNEL'}
                        </h3>

                        <form onSubmit={saveCrew} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <input type="text" placeholder="Full Name" value={editingCrew ? editingCrew.name : newCrew.name} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, name: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, name: e.target.value.toUpperCase() })} required />
                            <input type="text" placeholder="Role (e.g. DESIGN LEAD)" value={editingCrew ? editingCrew.role : newCrew.role} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, role: e.target.value.toUpperCase() }) : setNewCrew({ ...newCrew, role: e.target.value.toUpperCase() })} required />
                            <select value={editingCrew ? editingCrew.category : newCrew.category} onChange={e => editingCrew ? setEditingCrew({ ...editingCrew, category: e.target.value }) : setNewCrew({ ...newCrew, category: e.target.value })}>
                                <option value="CORE">CORE LEAD</option>
                                <option value="TECHNICAL">TECHNICAL DIVISION</option>
                                <option value="EVENTS">EVENTS MANAGEMENT</option>
                                <option value="DESIGN">CREATIVE DESIGN</option>
                                <option value="MEDIA">MEDIA GRID</option>
                                <option value="ROBOTICS">ROBOTICS & RC</option>
                                <option value="SPONSORS">SPONSOR RELATIONSHIP</option>
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
                                                <td>{member.category}</td>
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
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', color: '#00E5FF', letterSpacing: '0.15em', borderBottom: '1px solid rgba(0,229,255,0.1)', paddingBottom: '8px', marginBottom: '24px' }}>
                            {editingSponsor ? 'EDIT ALLIANCE SPONSOR' : 'ADD NEW SPONSOR ALLIANCE'}
                        </h3>

                        <form onSubmit={saveSponsor} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                            <input type="text" placeholder="Company Name" value={editingSponsor ? editingSponsor.name : newSponsor.name} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, name: e.target.value }) : setNewSponsor({ ...newSponsor, name: e.target.value })} required />
                            <select value={editingSponsor ? editingSponsor.category : newSponsor.category} onChange={e => editingSponsor ? setEditingSponsor({ ...editingSponsor, category: e.target.value }) : setNewSponsor({ ...newSponsor, category: e.target.value })}>
                                <option value="TITLE">TITLE PARTNER</option>
                                <option value="GOLD">GOLD SPONSOR</option>
                                <option value="SILVER">SILVER PARTNER</option>
                                <option value="MEDIA">MEDIA OUTLET</option>
                                <option value="BEVERAGE">BEVERAGE DIVISION</option>
                            </select>
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

            </main>
        </div>
    );
}
