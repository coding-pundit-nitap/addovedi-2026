import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

// Mock list of cyberpunk gamer avatars
const GAMER_AVATARS = [
    { id: 'specter', name: 'SPECTER_X9', color: '#00D9FF', desc: 'STEALTH OPERATIVE', border: 'rgba(0, 217, 255, 0.4)' },
    { id: 'cypher', name: 'CYPHER_NET', color: '#10B981', desc: 'CORE PROTOCOL INFILTRATOR', border: 'rgba(16, 185, 129, 0.4)' },
    { id: 'nebula', name: 'NEBULA_V', color: '#A855F7', desc: 'QUANTUM SINGULARITY RECON', border: 'rgba(168, 85, 247, 0.4)' },
    { id: 'aegis', name: 'AEGIS_SENTINEL', color: '#F59E0B', desc: 'HEAVY MECHA VANGUARD', border: 'rgba(245, 158, 11, 0.4)' }
];

const sanitizeUserForStorage = (userObj) => {
     const { password, ...safeUser } = userObj || {};
     return safeUser;
 };

export default function AuthModal() {
    const navigate = useNavigate();
    const setAuthModalOpen = useStore(s => s.setAuthModalOpen);
    const onClose = () => setAuthModalOpen(false);
    
    // Auth & registration state
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
    
    // Form Inputs
    const [authForm, setAuthForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    
    const [globalForm, setGlobalForm] = useState({
        gender: '',
        dob: '',
        college: '',
        department: '',
        year: '',
        state: '',
        city: '',
        emergencyContact: '',
        avatar: 'specter'
    });
    
    // Registered Events list
    const [registeredEvents, setRegisteredEvents] = useState([]);
    
    // Loading/scanning simulators
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Load logged in user from localStorage
        const storedUser = localStorage.getItem('addovedi_user');
        if (storedUser) {
            setUser(sanitizeUserForStorage(JSON.parse(storedUser)));
        }
        
        // Load registered events from localStorage
        const storedRegs = localStorage.getItem('addovedi_registrations');
        if (storedRegs) {
            setRegisteredEvents(JSON.parse(storedRegs));
        } else {
            setRegisteredEvents([]);
        }
    }, []);

    // Handle Input change for Auth Form
    const handleAuthChange = (e) => {
        setAuthForm({ ...authForm, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    // Handle Input change for Global Reg Form
    const handleGlobalChange = (e) => {
        setGlobalForm({ ...globalForm, [e.target.name]: e.target.value });
    };

    // Handle User Log In
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!authForm.email || !authForm.password) {
            setErrorMsg('ALL FIELDS INITIATION MANDATORY.');
            return;
        }
        
        // Check if user exists in mock / local storage
        const allUsers = JSON.parse(localStorage.getItem('addovedi_registered_accounts') || '[]');
        const found = allUsers.find(u => u.email.toLowerCase() === authForm.email.toLowerCase() && u.password === authForm.password);
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            if (found) {
                const safeFound = sanitizeUserForStorage(found);
                 setUser(safeFound);
                 localStorage.setItem('addovedi_user', JSON.stringify(safeFound));
                // Reload registrations
                const storedRegs = localStorage.getItem('addovedi_registrations') || '[]';
                setRegisteredEvents(JSON.parse(storedRegs));
            } else {
                setErrorMsg('CREDENTIAL VERIFICATION FAILURE. SYS_DENIED.');
            }
        }, 1200);
    };

    // Handle User Registration / Sign Up
    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!authForm.name || !authForm.email || !authForm.phone || !authForm.password) {
            setErrorMsg('ALL FIELDS REQUIRED FOR PROTOCOL ENLISTMENT.');
            return;
        }
        
        const allUsers = JSON.parse(localStorage.getItem('addovedi_registered_accounts') || '[]');
        if (allUsers.some(u => u.email.toLowerCase() === authForm.email.toLowerCase())) {
            setErrorMsg('EMAIL PROTOCOL ALREADY ENLISTED IN DATABASE.');
            return;
        }
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            const newUser = {
                name: authForm.name,
                email: authForm.email,
                phone: authForm.phone,
                password: authForm.password,
                isGlobalRegistered: false,
                addovediId: '',
                avatar: 'specter'
            };
            allUsers.push(sanitizeUserForStorage(newUser));
             localStorage.setItem('addovedi_registered_accounts', JSON.stringify(allUsers.map(sanitizeUserForStorage)));
             const safeNewUser = sanitizeUserForStorage(newUser);
             setUser(safeNewUser);
             localStorage.setItem('addovedi_user', JSON.stringify(safeNewUser));
        }, 1200);
    };

    // Handle Global Profile form submit
    const handleGlobalSubmit = (e) => {
        e.preventDefault();
        
        // Simple validations
        if (!globalForm.gender || !globalForm.dob || !globalForm.college || !globalForm.department || !globalForm.year || !globalForm.state || !globalForm.city || !globalForm.emergencyContact) {
            setErrorMsg('ALL BLOCKS MANDATORY FOR UNIQUE SIGNATURE SIGN-OFF.');
            return;
        }
        
        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            // Generate Atomic Counter ID (randomised frontend sequence starting from 1000)
            const seedCounter = parseInt(localStorage.getItem('addovedi_id_counter') || '142');
            const newCounter = seedCounter + 1;
            localStorage.setItem('addovedi_id_counter', newCounter.toString());
            const padId = newCounter.toString().padStart(4, '0');
            const generatedId = `ADV26-${padId}`;
            
            const updatedUser = {
                ...user,
                ...globalForm,
                isGlobalRegistered: true,
                addovediId: generatedId
            };
            
            // Save inside both current user and registered users array
            const safeUpdatedUser = sanitizeUserForStorage(updatedUser);
             setUser(safeUpdatedUser);
             localStorage.setItem('addovedi_user', JSON.stringify(safeUpdatedUser));
            
            const allUsers = JSON.parse(localStorage.getItem('addovedi_registered_accounts') || '[]');
            const idx = allUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (idx !== -1) {
                allUsers[idx] = safeUpdatedUser;
            } else {
                allUsers.push(safeUpdatedUser);
            }
            localStorage.setItem('addovedi_registered_accounts', JSON.stringify(allUsers.map(sanitizeUserForStorage)));
            setErrorMsg('');
        }, 1500);
    };

    // Sign out / Log out
    const handleLogout = () => {
        localStorage.removeItem('addovedi_user');
        setUser(null);
        setAuthForm({ name: '', email: '', phone: '', password: '' });
        setGlobalForm({
            gender: '',
            dob: '',
            college: '',
            department: '',
            year: '',
            state: '',
            city: '',
            emergencyContact: '',
            avatar: 'specter'
        });
        setErrorMsg('');
    };

    const currentAvatarData = GAMER_AVATARS.find(a => a.id === (user?.avatar || globalForm.avatar)) || GAMER_AVATARS[0];

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            style={{
                background: 'rgba(1, 3, 8, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                fontFamily: "'Rajdhani', sans-serif"
            }}
        >
            {/* Embedded styles for styling inputs and elements */}
            <style dangerouslySetInnerHTML={{ __html: `
                .hud-input {
                    background: rgba(2, 8, 18, 0.7);
                    border: 1px solid rgba(0, 217, 255, 0.25);
                    color: #fff;
                    font-family: 'Rajdhani', sans-serif;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    transition: all 0.3s ease;
                }
                .hud-input:focus {
                    outline: none;
                    border-color: rgba(0, 217, 255, 0.8);
                    box-shadow: 0 0 12px rgba(0, 217, 255, 0.2);
                    background: rgba(2, 8, 18, 0.9);
                }
                .glow-btn {
                    position: relative;
                    font-family: 'Orbitron', monospace;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #fff;
                    background: transparent;
                    overflow: hidden;
                    clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
                    transition: transform 0.2s ease, opacity 0.2s ease;
                    cursor: pointer;
                    border: none;
                }
                .glow-btn:hover {
                    transform: translateY(-1px);
                }
                .glow-btn:active {
                    transform: scale(0.98);
                }
                .glow-btn-fill {
                    position: absolute;
                    inset: 1.5px;
                    clip-path: polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px);
                    background: linear-gradient(90deg, #0891b2 0%, #00D9FF 70%, #67e8f9 100%);
                    transition: opacity 0.3s ease;
                }
                .glow-btn:hover .glow-btn-fill {
                    filter: brightness(1.1);
                }
                .avatar-card {
                    border: 1.5px solid rgba(255, 255, 255, 0.06);
                    background: rgba(255, 255, 255, 0.01);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }
                .avatar-card:hover {
                    background: rgba(255, 255, 255, 0.03);
                }
                .portal-grid-bg {
                    background-image: linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px);
                    background-size: 32px 32px;
                }
                @keyframes scan-vertical {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .scanner-line {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #00D9FF, transparent);
                    box-shadow: 0 0 10px #00D9FF, 0 0 20px #00D9FF;
                    position: absolute;
                    left: 0;
                    right: 0;
                    animation: scan-vertical 4.2s linear infinite;
                    pointer-events: none;
                }
                .auth-modal-scrollbar::-webkit-scrollbar { width: 4px; }
                .auth-modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .auth-modal-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 217, 255, 0.2); border-radius: 2px; }
            ` }} />

            {/* Glowing background grid inside modal */}
            <div className="absolute inset-0 portal-grid-bg pointer-events-none opacity-20 z-0" />

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[10000] group"
                style={{
                    width: '40px',
                    height: '40px',
                    border: '1.5px solid rgba(0, 217, 255, 0.4)',
                    background: 'rgba(2, 7, 16, 0.8)',
                    color: '#00D9FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    fontSize: '18px',
                    fontFamily: "'Orbitron', monospace",
                    fontWeight: 900,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.8)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(2, 7, 16, 0.8)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.4)';
                }}
            >
                ✕
            </button>

            {/* Main Content Area */}
            <div className="flex items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto max-h-[90vh] overflow-y-auto auth-modal-scrollbar">
                <AnimatePresence mode="wait">
                    {!user ? (
                        /* ──────────────────────── STAGE 1: AUTHENTICATION (LOGIN/SIGNUP) ──────────────────────── */
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md relative p-6 md:p-8"
                            style={{
                                background: 'rgba(2, 7, 16, 0.85)',
                                border: '1.5px solid rgba(0, 217, 255, 0.4)',
                                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 0 35px rgba(0, 217, 255, 0.15)'
                            }}
                        >
                            {/* Scanning indicator */}
                            <div className="scanner-line" />

                            {/* Hex corner decals */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00D9FF]" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00D9FF]" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00D9FF]" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00D9FF]" />

                            {/* Header Section */}
                            <div className="flex flex-col items-center mb-6 text-center">
                                <span style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.3em',
                                    color: '#00D9FF',
                                    textShadow: '0 0 8px rgba(0, 217, 255, 0.6)'
                                }} className="font-black">CORE_AUTH // INTERFACE</span>
                                <h1 style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '1.45rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.08em',
                                    color: '#fff',
                                    marginTop: '4px'
                                }}>ADDOVEDI ID PORTAL</h1>
                                <p className="text-[11px] text-white/40 tracking-widest mt-1">ESTABLISH CHANNELS FOR SECURE ACCESS</p>
                            </div>

                            {/* Tabs selector */}
                            <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-none border border-white/10 mb-6 relative">
                                <button
                                    onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                                    className={`py-2 text-xs font-bold tracking-widest transition-all duration-300 ${activeTab === 'login' ? 'text-[#00D9FF] bg-[#00D9FF]/10 border-b border-[#00D9FF]' : 'text-white/40 hover:text-white/80'}`}
                                    style={{ fontFamily: "'Orbitron', monospace" }}
                                >
                                    ACCESS CREDENTIALS
                                </button>
                                <button
                                    onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
                                    className={`py-2 text-xs font-bold tracking-widest transition-all duration-300 ${activeTab === 'signup' ? 'text-[#00D9FF] bg-[#00D9FF]/10 border-b border-[#00D9FF]' : 'text-white/40 hover:text-white/80'}`}
                                    style={{ fontFamily: "'Orbitron', monospace" }}
                                >
                                    ENLIST NEW PLAYER
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={activeTab === 'login' ? handleLoginSubmit : handleSignupSubmit} className="flex flex-col gap-4">
                                {activeTab === 'signup' && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Player Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={authForm.name}
                                            onChange={handleAuthChange}
                                            placeholder="e.g. ALEX MERCER"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Secure Email address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={authForm.email}
                                        onChange={handleAuthChange}
                                        placeholder="e.g. recruit@addovedi.in"
                                        className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {activeTab === 'signup' && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={authForm.phone}
                                            onChange={handleAuthChange}
                                            placeholder="e.g. +91 98765 43210"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Access Code / Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={authForm.password}
                                        onChange={handleAuthChange}
                                        placeholder="••••••••"
                                        className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Error Log */}
                                {errorMsg && (
                                    <div 
                                        className="border border-red-500/30 bg-red-950/20 text-red-400 p-2.5 text-[10px] tracking-wider font-semibold uppercase flex items-center gap-2 select-none"
                                        style={{ fontFamily: "'Orbitron', monospace" }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                        <span>[ SYS_ERR ] : {errorMsg}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="glow-btn py-3.5 w-full relative z-10 flex items-center justify-center gap-2 shrink-0"
                                >
                                    <span className="glow-btn-fill" />
                                    <span className="relative z-20 font-bold uppercase">
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                DECRYPTING PROTOCOLS...
                                            </span>
                                        ) : activeTab === 'login' ? 'INITIALIZE LINK ▶' : 'COMMENCE ENLISTMENT ▶'}
                                    </span>
                                </button>
                            </form>
                        </motion.div>
                    ) : !user.isGlobalRegistered ? (
                        /* ──────────────────────── STAGE 2: GLOBAL PROFILE REGISTRATION ──────────────────────── */
                        <motion.div
                            key="global"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-2xl relative p-6 md:p-8"
                            style={{
                                background: 'rgba(2, 7, 16, 0.9)',
                                border: '1.5px solid rgba(0, 217, 255, 0.4)',
                                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 0 35px rgba(0, 217, 255, 0.15)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-3 text-[9px] tracking-widest text-[#00D9FF]/40 font-mono">
                                STEP_02 // SYSTEM_PROFILE_SYNC
                            </div>

                            {/* Header Section */}
                            <div className="mb-6 border-b border-[#00f0ff]/15 pb-4">
                                <span style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.3em',
                                    color: '#00D9FF',
                                    textShadow: '0 0 8px rgba(0, 217, 255, 0.6)'
                                }} className="font-black">PROTOCOL_02 // REGISTRATION</span>
                                <h1 style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '1.3rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.08em',
                                    color: '#fff',
                                    marginTop: '4px'
                                }}>GLOBAL PARTICIPANT RECORD</h1>
                                <p className="text-[11px] text-white/40 tracking-widest mt-1">COMPILE PROFILE TO ACQUIRE YOUR UNIQUE ADDOVEDI PASSPORT ID</p>
                            </div>

                            <form onSubmit={handleGlobalSubmit} className="flex flex-col gap-6">
                                {/* Form fields grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Biological Gender</label>
                                        <select
                                            name="gender"
                                            value={globalForm.gender}
                                            onChange={handleGlobalChange}
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none bg-[#020812]"
                                        >
                                            <option value="">SELECT DISPOSITION</option>
                                            <option value="Male">MALE</option>
                                            <option value="Female">FEMALE</option>
                                            <option value="Other">OTHER // SECURE</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={globalForm.dob}
                                            onChange={handleGlobalChange}
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">College / University</label>
                                        <input
                                            type="text"
                                            name="college"
                                            value={globalForm.college}
                                            onChange={handleGlobalChange}
                                            placeholder="e.g. NATIONAL INSTITUTE OF TECHNOLOGY"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Department / Stream</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={globalForm.department}
                                            onChange={handleGlobalChange}
                                            placeholder="e.g. ELECTRONICS & COMMUNICATION"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Academic Year / Semester</label>
                                        <select
                                            name="year"
                                            value={globalForm.year}
                                            onChange={handleGlobalChange}
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none bg-[#020812]"
                                        >
                                            <option value="">SELECT YEAR</option>
                                            <option value="1st Year">1ST YEAR // RECRUIT</option>
                                            <option value="2nd Year">2ND YEAR // AGENT</option>
                                            <option value="3rd Year">3RD YEAR // ELITE</option>
                                            <option value="4th Year">4TH YEAR // COMMANDER</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={globalForm.state}
                                            onChange={handleGlobalChange}
                                            placeholder="e.g. MAHARASHTRA"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={globalForm.city}
                                            onChange={handleGlobalChange}
                                            placeholder="e.g. NAGPUR"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">Emergency Contact Number</label>
                                        <input
                                            type="tel"
                                            name="emergencyContact"
                                            value={globalForm.emergencyContact}
                                            onChange={handleGlobalChange}
                                            placeholder="e.g. Guardian Contact Number"
                                            className="hud-input px-3.5 py-2.5 text-xs rounded-none"
                                        />
                                    </div>
                                </div>

                                {/* Avatar selection widget */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-white/50 tracking-wider font-bold uppercase">CHOOSE PLAYER AVATAR PROFILE</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {GAMER_AVATARS.map(avatar => {
                                            const isSelected = globalForm.avatar === avatar.id;
                                            return (
                                                <div
                                                    key={avatar.id}
                                                    onClick={() => setGlobalForm({ ...globalForm, avatar: avatar.id })}
                                                    className="avatar-card p-3 flex flex-col items-center text-center gap-1.5 relative border"
                                                    style={{
                                                        borderColor: isSelected ? avatar.color : 'rgba(255,255,255,0.06)',
                                                        boxShadow: isSelected ? `0 0 15px ${avatar.color}25` : 'none',
                                                        background: isSelected ? `${avatar.color}05` : 'transparent'
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <span className="w-1.5 h-1.5 rounded-full absolute top-2 right-2 animate-pulse" style={{ backgroundColor: avatar.color }} />
                                                    )}
                                                    <div 
                                                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm relative"
                                                        style={{
                                                            background: `${avatar.color}15`,
                                                            color: avatar.color,
                                                            border: `1.5px solid ${avatar.color}40`,
                                                            textShadow: `0 0 8px ${avatar.color}`
                                                        }}
                                                    >
                                                        {avatar.name[0]}
                                                    </div>
                                                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>{avatar.name}</span>
                                                    <span style={{ fontSize: '7px', color: avatar.color, fontWeight: 700, letterSpacing: '0.05em' }}>{avatar.desc}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {errorMsg && (
                                    <div className="border border-red-500/30 bg-red-950/20 text-red-400 p-2.5 text-[10px] tracking-wider font-semibold uppercase flex items-center gap-2 select-none" style={{ fontFamily: "'Orbitron', monospace" }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                        <span>[ SYS_ERR ] : {errorMsg}</span>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="py-3 px-6 text-white/50 hover:text-white border border-white/10 hover:bg-white/5 text-[10px] tracking-widest font-black uppercase rounded-none transition-colors"
                                        style={{ fontFamily: "'Orbitron', monospace" }}
                                    >
                                        ABORT REGISTRATION
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="glow-btn py-3.5 flex-1 relative z-10 flex items-center justify-center gap-2"
                                    >
                                        <span className="glow-btn-fill" />
                                        <span className="relative z-20 font-bold uppercase text-white">
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    GENERATING UNIQUE SYSTEM ID...
                                                </span>
                                            ) : 'COMPILE & GENERATE ID ▶'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        /* ──────────────────────── STAGE 3: PARTICIPANT DASHBOARD ──────────────────────── */
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pointer-events-auto"
                        >
                            {/* LEFT PANEL: Digital ID Card */}
                            <div className="lg:col-span-5 flex flex-col items-center">
                                <div 
                                    className="w-[330px] h-[480px] p-6 relative overflow-hidden select-none border border-cyan-400/40 rounded-none shadow-[0_0_35px_rgba(0,217,255,0.15)] flex flex-col items-center justify-between"
                                    style={{
                                        background: 'linear-gradient(185deg, #020712 0%, #041021 100%)',
                                        clipPath: 'polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 25px)'
                                    }}
                                >
                                    <div className="scanner-line" />

                                    <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
                                        backgroundImage: 'linear-gradient(rgba(0,217,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.2) 1px, transparent 1px)',
                                        backgroundSize: '12px 12px',
                                    }} />

                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00D9FF]" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00D9FF]" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00D9FF]" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00D9FF]" />

                                    <div className="w-full flex items-center justify-between border-b border-[#00d9ff]/20 pb-3 relative z-10">
                                        <div className="flex flex-col">
                                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '10px', fontWeight: 900, color: '#00D9FF', letterSpacing: '0.15em', textShadow: '0 0 8px rgba(0,217,255,0.6)' }}>ADDOVEDI 2026</span>
                                            <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', tracking: '0.1em' }} className="font-mono">SYS_ID_CARD // DEMO</span>
                                        </div>
                                        <div 
                                            className="px-2 py-0.5 text-[7.5px] border font-black tracking-widest uppercase"
                                            style={{
                                                borderColor: `${currentAvatarData.color}40`,
                                                color: currentAvatarData.color,
                                                background: `${currentAvatarData.color}0d`
                                            }}
                                        >
                                            ACTIVE_SECURE
                                        </div>
                                    </div>

                                    <div className="relative mt-4 z-10">
                                        <div 
                                            className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-dashed relative animate-spin-slow"
                                            style={{
                                                borderColor: `${currentAvatarData.color}40`,
                                                animationDuration: '15s'
                                            }}
                                        />
                                        <div 
                                            className="w-28 h-28 rounded-full absolute top-2 left-2 flex items-center justify-center text-3xl font-black border-2"
                                            style={{
                                                background: `radial-gradient(circle, ${currentAvatarData.color}25 0%, #030c17 100%)`,
                                                color: currentAvatarData.color,
                                                borderColor: currentAvatarData.color,
                                                textShadow: `0 0 10px ${currentAvatarData.color}`
                                            }}
                                        >
                                            {user.name ? user.name[0] : 'G'}
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col items-center mt-2 relative z-10 text-center">
                                        <span className="text-[#00D9FF] text-[8px] font-mono tracking-[0.2em] font-bold uppercase mb-1">
                                            [ USERNAME_SIGNATURE ]
                                        </span>
                                        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>
                                            {user.name}
                                        </h2>
                                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            {user.college}
                                        </span>
                                        <span style={{ fontSize: '9px', color: currentAvatarData.color, fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }} className="uppercase">
                                            {user.department} // {user.year}
                                        </span>
                                    </div>

                                    <div 
                                        className="w-full border border-cyan-400/25 p-3 flex flex-col items-center relative mt-3 select-none"
                                        style={{
                                            background: 'rgba(0,217,255,0.03)',
                                            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                                        }}
                                    >
                                        <span className="text-[7.5px] font-mono tracking-[0.25em] text-[#00d9ff]/60 uppercase font-black mb-1">
                                            UNIQUE_ADDOVEDI_ID
                                        </span>
                                        <span 
                                            style={{
                                                fontFamily: "'Orbitron', monospace",
                                                fontWeight: 950,
                                                fontSize: '1.38rem',
                                                letterSpacing: '0.15em',
                                                color: '#fff',
                                                textShadow: '0 0 15px rgba(0,217,255,0.8), 0 0 30px rgba(0,217,255,0.4)'
                                            }}
                                        >
                                            {user.addovediId}
                                        </span>
                                    </div>

                                    <div className="w-full flex items-center justify-between border-t border-[#00d9ff]/15 pt-4 mt-3 relative z-10 select-none">
                                        <div className="flex flex-col items-start font-mono gap-1 text-[7px] text-white/40">
                                            <span>ISSUED: ADDOVEDI_OS</span>
                                            <span>LEVEL: GUEST_LEVEL_1</span>
                                            <span>VERIFIER: SECURE_QR</span>
                                        </div>

                                        <div 
                                            className="w-12 h-12 p-1 border flex items-center justify-center"
                                            style={{
                                                borderColor: 'rgba(0,217,255,0.25)',
                                                background: 'rgba(255,255,255,0.02)'
                                            }}
                                        >
                                            <svg className="w-full h-full text-[#00D9FF]" viewBox="0 0 100 100" fill="currentColor">
                                                <rect x="0" y="0" width="30" height="30" />
                                                <rect x="5" y="5" width="20" height="20" fill="#020712" />
                                                <rect x="10" y="10" width="10" height="10" />
                                                <rect x="70" y="0" width="30" height="30" />
                                                <rect x="75" y="5" width="20" height="20" fill="#020712" />
                                                <rect x="80" y="10" width="10" height="10" />
                                                <rect x="0" y="70" width="30" height="30" />
                                                <rect x="5" y="75" width="20" height="20" fill="#020712" />
                                                <rect x="10" y="80" width="10" height="10" />
                                                <rect x="40" y="0" width="10" height="15" />
                                                <rect x="55" y="10" width="10" height="10" />
                                                <rect x="40" y="25" width="20" height="10" />
                                                <rect x="70" y="40" width="10" height="20" />
                                                <rect x="90" y="40" width="10" height="10" />
                                                <rect x="0" y="45" width="15" height="15" />
                                                <rect x="25" y="40" width="10" height="10" />
                                                <rect x="40" y="50" width="15" height="20" />
                                                <rect x="15" y="85" width="10" height="15" fill="#020712" />
                                                <rect x="45" y="80" width="15" height="10" />
                                                <rect x="75" y="85" width="20" height="10" />
                                                <rect x="85" y="70" width="10" height="10" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="mt-4 px-6 py-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/30 text-[9px] font-bold tracking-widest uppercase transition-colors animate-pulse"
                                    style={{ fontFamily: "'Orbitron', monospace" }}
                                >
                                    ABORT_CONNECTION // LOG OUT
                                </button>
                            </div>

                            {/* RIGHT PANEL: Registered Events List */}
                            <div 
                                className="lg:col-span-7 p-6 relative flex flex-col justify-between"
                                style={{
                                    background: 'rgba(2, 7, 16, 0.85)',
                                    border: '1.5px solid rgba(0, 217, 255, 0.4)',
                                    clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00D9FF]" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00D9FF]" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00D9FF]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00D9FF]" />

                                <div>
                                    <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-4 mb-4 select-none">
                                        <div className="flex flex-col">
                                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 900, color: '#00D9FF', letterSpacing: '0.15em' }}>MISSION_ENLISTMENTS</span>
                                            <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: '1.18rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>REGISTERED EVENTS</h2>
                                        </div>
                                        <span className="text-[10px] text-white/50 font-mono font-bold tracking-widest uppercase">
                                            COUNT: {registeredEvents.length}
                                        </span>
                                    </div>

                                    {registeredEvents.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center text-center gap-4 select-none">
                                            <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/25 font-bold animate-pulse">
                                                ⚠
                                            </div>
                                            <div>
                                                <h3 className="text-white text-sm font-black tracking-widest uppercase">No Active Mission Registrations</h3>
                                                <p className="text-xs text-white/45 mt-1 max-w-[280px] mx-auto leading-relaxed">
                                                    You have not enlisted in any arena events. Launch the Arena console to join competitions.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                            {registeredEvents.map((reg, index) => (
                                                <div 
                                                    key={reg.id || index}
                                                    className="p-3 border flex flex-col md:flex-row md:items-center justify-between gap-3 relative select-none"
                                                    style={{
                                                        background: 'rgba(255,255,255,0.01)',
                                                        borderColor: 'rgba(0, 217, 255, 0.15)'
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div 
                                                            className="w-1.5 h-10 shrink-0" 
                                                            style={{
                                                                background: '#00D9FF'
                                                            }}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-black text-sm tracking-wider uppercase">{reg.title}</span>
                                                            <span className="text-[10px] text-white/40 tracking-wider font-semibold uppercase">{reg.category} // {reg.venue || 'TBA'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end justify-between font-mono gap-1">
                                                        <span className="text-[9px] text-[#00D9FF] font-black tracking-widest uppercase">
                                                            SLOT_VERIFIED
                                                        </span>
                                                        <span className="text-[7.5px] text-white/30 uppercase">
                                                            TEAM: {reg.teamName || 'SOLO'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-4 border-t border-[#00f0ff]/15 flex items-center justify-between select-none">
                                    <div className="flex flex-col text-left">
                                        <span className="text-[9px] text-white/45 uppercase tracking-widest font-black">Ready to deploy?</span>
                                        <span className="text-[10px] text-[#00D9FF] font-semibold tracking-wider">Access the Event Arena for additional challenges.</span>
                                    </div>

                                    <div className="reg-btn-wrap">
                                        <button
                                            onClick={() => { onClose(); navigate('/event'); }}
                                            className="reg-btn group py-3 px-6 shrink-0"
                                        >
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                                    backgroundSize: '250% 250%',
                                                    animation: 'border-flow 2.8s ease infinite',
                                                }}
                                            />
                                            <div
                                                className="absolute"
                                                style={{
                                                    inset: '1.5px',
                                                    clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                                    background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                                }}
                                            />
                                            <span className="reg-fill" />
                                            <div className="relative z-10 flex items-center gap-1.5 font-black text-[10px]">
                                                <span>ENTER ARENA</span>
                                                <span className="group-hover:translate-x-1 transition-transform">▶</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
