import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function HeroOverlay() {
    const navigate = useNavigate();
    // 60 FPS direct-DOM speedometer loop to bypass React render cycle overhead
    useEffect(() => {
        let active = true;
        const updateSpeed = () => {
            const el = document.getElementById('cockpit-speedometer');
            if (el) {
                const speed = window.tunnelSpeed || 0;
                el.innerText = `${Math.round(speed * 16.2)} KM/H`;
            }
            if (active) requestAnimationFrame(updateSpeed);
        };
        updateSpeed();
        return () => { active = false; };
    }, []);
    const showLogo = useStore(s => s.showLogo);
    const showNavbar = useStore(s => s.showNavbar);
    const showButton = useStore(s => s.showButton);
    const isEventPage = useStore(s => s.isEventPage);

    const setIsEntered = useStore(s => s.setIsEntered);
    
    // Connect Hub state & dynamic countdown timer
    const [isFooterOpen, setIsFooterOpen] = useState(false);
    const isSidebarOpen = useStore(s => s.isSidebarOpen);
    const setIsSidebarOpen = useStore(s => s.setIsSidebarOpen);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date('2026-09-12T00:00:00');
        const updateCountdown = () => {
            const difference = targetDate.getTime() - new Date().getTime();
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);
            setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);
    const setShowButton = useStore(s => s.setShowButton);
    const setShowLogo = useStore(s => s.setShowLogo);
    const setShowNavbar = useStore(s => s.setShowNavbar);
    const setAuthModalOpen = useStore(s => s.setAuthModalOpen);

    const handleEnterArena = () => {
        // Hide UI overlays so the cinematic fly-in is unobstructed
        setShowButton(false);
        setShowLogo(false);
        setShowNavbar(false);
        // Trigger the 4-phase camera sequence in CameraRig
        setIsEntered(true);
    };

    return (
        <>
            {/* ── Main HUD Overlay ── */}
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none p-3 sm:p-6 font-sans">

                {/* Navbar */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

                    @keyframes nav-scanline {
                        0%   { background-position: 0 0; }
                        100% { background-position: 0 4px; }
                    }
                    @keyframes glow-pulse {
                        0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 6px #00D9FF); }
                        50%       { opacity: 1;   filter: drop-shadow(0 0 14px #00D9FF) drop-shadow(0 0 28px #00D9FF); }
                    }
                    @keyframes border-flow {
                        0%   { background-position: 0% 50%; }
                        50%  { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes cyan-pulse {
                        0%, 100% { box-shadow: 0 0 14px rgba(0,217,255,0.35), 0 0 28px rgba(0,217,255,0.15); }
                        50%       { box-shadow: 0 0 26px rgba(0,217,255,0.65), 0 0 50px rgba(0,217,255,0.3); }
                    }
                    @keyframes arena-glow {
                        0%, 100% { box-shadow: 0 0 30px rgba(0,240,255,0.2), inset 0 0 30px rgba(0,240,255,0.06); }
                        50%       { box-shadow: 0 0 60px rgba(0,240,255,0.4), inset 0 0 40px rgba(0,240,255,0.12); }
                    }
                    @keyframes dot-blink {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50%       { opacity: 0.4; transform: scale(0.7); }
                    }

                    /* ── Nav links ── */
                    .nav-link-item {
                        position: relative;
                        font-family: 'Orbitron', monospace;
                        font-size: 0.68rem;
                        letter-spacing: 0.18em;
                        text-transform: uppercase;
                        font-weight: 600;
                        color: rgba(180,210,255,0.5);
                        padding: 10px 18px;
                        transition: color 0.25s ease;
                        cursor: pointer;
                        text-decoration: none;
                    }
                    .nav-link-item::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(135deg, rgba(0,217,255,0.05), rgba(168,85,247,0.05));
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .nav-link-item::after {
                        content: '';
                        position: absolute;
                        bottom: 4px;
                        left: 50%;
                        transform: translateX(-50%) scaleX(0);
                        width: 70%;
                        height: 2px;
                        background: linear-gradient(90deg, #00D9FF, #A855F7);
                        border-radius: 2px;
                        box-shadow: 0 0 8px #00D9FF, 0 0 16px rgba(168,85,247,0.4);
                        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
                    }
                    .nav-link-item:hover {
                        color: #ffffff;
                        text-shadow: 0 0 10px rgba(0,217,255,0.8), 0 0 22px rgba(0,217,255,0.3);
                    }
                    .nav-link-item:hover::before { opacity: 1; }
                    .nav-link-item:hover::after  { transform: translateX(-50%) scaleX(1); }

                    .nav-link-active {
                        color: #00D9FF !important;
                        text-shadow: 0 0 10px #00D9FF, 0 0 22px rgba(0,217,255,0.6) !important;
                    }
                    .nav-link-active::after {
                        transform: translateX(-50%) scaleX(1) !important;
                        background: #00D9FF !important;
                        box-shadow: 0 0 10px #00D9FF, 0 0 20px rgba(0,217,255,0.6) !important;
                    }
                    .nav-link-active .nav-corner-tl,
                    .nav-link-active .nav-corner-br { opacity: 1 !important; }

                    .nav-corner-tl, .nav-corner-br {
                        position: absolute;
                        width: 7px;
                        height: 7px;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .nav-corner-tl {
                        top: 5px; left: 10px;
                        border-top: 1.5px solid #00D9FF;
                        border-left: 1.5px solid #00D9FF;
                        box-shadow: -1px -1px 6px rgba(0,217,255,0.5);
                    }
                    .nav-corner-br {
                        bottom: 5px; right: 10px;
                        border-bottom: 1.5px solid #A855F7;
                        border-right: 1.5px solid #A855F7;
                        box-shadow: 1px 1px 6px rgba(168,85,247,0.5);
                    }

                    /* ── Mobile Sidebar Navigation Links ── */
                    .mobile-nav-link {
                        position: relative;
                        font-family: 'Orbitron', monospace;
                        font-size: 0.72rem;
                        letter-spacing: 0.18em;
                        text-transform: uppercase;
                        font-weight: 600;
                        color: rgba(180,210,255,0.55);
                        padding: 12px 20px;
                        border-left: 2.5px solid transparent;
                        background: rgba(0, 217, 255, 0.02);
                        margin-bottom: 4px;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        text-decoration: none;
                        display: block;
                    }
                    .mobile-nav-link:hover {
                        color: #00D9FF;
                        background: rgba(0, 217, 255, 0.08);
                        border-left: 2.5px solid rgba(0, 217, 255, 0.7);
                        text-shadow: 0 0 8px rgba(0,217,255,0.6);
                    }
                    .mobile-nav-link-active {
                        color: #00D9FF !important;
                        background: rgba(0, 217, 255, 0.12) !important;
                        border-left: 2.5px solid #00D9FF !important;
                        text-shadow: 0 0 10px #00D9FF !important;
                        box-shadow: inset 4px 0 12px rgba(0, 217, 255, 0.05);
                    }

                    /* ── Responsive Enter the Arena button elements ── */
                    .arena-btn-content {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        align-items: center;
                        padding: 11px 18px;
                        gap: 12px;
                    }
                    @media (min-width: 640px) {
                        .arena-btn-content {
                            padding: 18px 40px;
                            gap: 24px;
                        }
                    }
                    .arena-dpad {
                        position: relative;
                        width: 20px;
                        height: 20px;
                        flex-shrink: 0;
                        opacity: 0.6;
                    }
                    @media (min-width: 640px) {
                        .arena-dpad {
                            width: 32px;
                            height: 32px;
                        }
                    }
                    .arena-face-buttons {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 4px;
                        flex-shrink: 0;
                    }
                    @media (min-width: 640px) {
                        .arena-face-buttons {
                            gap: 6px;
                        }
                    }
                    .arena-face-button {
                        width: 13px;
                        height: 13px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 5px;
                        font-weight: 700;
                    }
                    @media (min-width: 640px) {
                        .arena-face-button {
                            width: 20px;
                            height: 20px;
                            font-size: 8px;
                        }
                    }
                    .arena-btn-title {
                        font-size: 0.78rem;
                        font-weight: 900;
                        letter-spacing: 0.22em;
                        text-transform: uppercase;
                        color: #00f0ff;
                        text-shadow: 0 0 14px rgba(0,240,255,0.9), 0 0 30px rgba(0,240,255,0.4);
                        white-space: nowrap;
                        user-select: none;
                    }
                    @media (min-width: 640px) {
                        .arena-btn-title {
                            font-size: 1rem;
                            letter-spacing: 0.32em;
                        }
                    }
                    .arena-btn-subtitle {
                        font-size: 0.35rem;
                        letter-spacing: 0.35em;
                        color: rgba(0,240,255,0.38);
                        text-transform: uppercase;
                        font-family: monospace;
                        user-select: none;
                    }
                    @media (min-width: 640px) {
                        .arena-btn-subtitle {
                            font-size: 0.42rem;
                            letter-spacing: 0.45em;
                        }
                    }

                    /* ── REGISTER button ── */
                    .reg-btn-wrap {
                        position: relative;
                        display: inline-block;
                    }
                    .reg-btn {
                        position: relative;
                        font-family: 'Orbitron', monospace;
                        font-size: 0.65rem;
                        font-weight: 800;
                        letter-spacing: 0.28em;
                        text-transform: uppercase;
                        color: #fff;
                        padding: 11px 28px;
                        overflow: hidden;
                        clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
                        transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
                        animation: cyan-pulse 2.5s ease-in-out infinite;
                    }
                    .reg-btn:hover {
                        transform: scale(1.05) translateY(-1px);
                    }
                    /* Left-to-right cyan wipe fill */
                    .reg-fill {
                        position: absolute;
                        inset: 1.5px;
                        clip-path: polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px);
                        background: linear-gradient(90deg, #0891b2 0%, #06b6d4 35%, #00D9FF 70%, #67e8f9 100%);
                        transform-origin: left center;
                        transform: scaleX(0);
                        transition: transform 0.42s cubic-bezier(0.16,1,0.3,1);
                        pointer-events: none;
                    }
                    .reg-btn:hover .reg-fill {
                        transform: scaleX(1);
                    }
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    /* Hide scrollbar for IE, Edge and Firefox */
                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}} />

                {/* Navbar */}
                <AnimatePresence>
                    {showNavbar && (
                        <motion.nav
                            key="navbar"
                            initial={{ opacity: 0, y: -28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="w-full max-w-7xl mx-auto flex items-center justify-between text-white pointer-events-auto px-2 sm:px-10 relative overflow-visible"
                            style={{ height: '88px' }}
                        >
                            {/* Subtle scanline bg strip */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(0,217,255,0.04) 0%, rgba(2,6,12,0.55) 60%, rgba(0,217,255,0.025) 100%)',
                                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,217,255,0.025) 3px, rgba(0,217,255,0.025) 4px)',
                                    animation: 'nav-scanline 0.3s linear infinite',
                                }}
                            />


                            {/* ── Left: Brand Logo ── */}
                            <div className="flex items-center gap-3 font-mono relative z-10">
                                <div className="relative" style={{ animation: 'glow-pulse 2.8s ease-in-out infinite' }}>
                                    <svg className="w-11 h-11 text-[#00D9FF]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" />
                                        <circle cx="50" cy="50" r="32" strokeWidth="1" />
                                        <circle cx="50" cy="50" r="24" strokeWidth="1.5" strokeDasharray="10 5" />
                                        <circle cx="50" cy="50" r="14" strokeWidth="1.2" />
                                        <path d="M 50 14 L 50 24 M 50 76 L 50 86 M 14 50 L 24 50 M 76 50 L 86 50" strokeWidth="1.5" />
                                        <circle cx="50" cy="50" r="4.5" fill="#00D9FF" />
                                    </svg>
                                    <div className="absolute inset-0 bg-[#00D9FF]/10 rounded-full blur-lg" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1.5 leading-none">
                                        <span
                                            style={{
                                                fontFamily: "'Orbitron', monospace",
                                                fontWeight: 900,
                                                fontSize: '1.15rem',
                                                letterSpacing: '0.25em',
                                                background: 'linear-gradient(90deg, #00D9FF 0%, #a8f0ff 50%, #00D9FF 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                filter: 'drop-shadow(0 0 10px rgba(0,217,255,0.7))',
                                            }}
                                        >ADDOVEDI</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-[3px] leading-none">
                                        <span
                                            className="text-xs font-black tracking-widest"
                                            style={{
                                                background: 'linear-gradient(90deg, #FF2EA6, #ff85cc)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                filter: 'drop-shadow(0 0 6px rgba(255,46,166,0.6))',
                                            }}
                                        >2026</span>
                                    </div>
                                    <div className="w-24 h-[1px] my-[3px]" style={{ background: 'linear-gradient(90deg, #00D9FF40, transparent)' }} />
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" style={{ boxShadow: '0 0 6px #00D9FF' }} />
                                        <span className="text-[7.5px] text-[#00D9FF] tracking-widest uppercase font-bold" style={{ textShadow: '0 0 8px rgba(0,217,255,0.7)' }}>SYSTEM ONLINE</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Center Navigation Links (Hidden on mobile/tablet) ── */}
                            <div className="hidden lg:flex items-center relative z-10">
                                {[
                                    { label: 'HOME', active: !isFooterOpen },
                                    { label: 'ARENA', active: false },
                                    { label: 'TIMELINE', active: false },
                                    { label: 'ALLIANCES', active: false },
                                    { label: 'CREW', active: false },
                                    { label: 'CONNECT HUB', active: isFooterOpen },
                                ].map(({ label, active }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (label === 'CONNECT HUB') {
                                                navigate('/connect');
                                            } else if (label === 'HOME') {
                                                setIsFooterOpen(false);
                                            } else if (label === 'ARENA') {
                                                navigate('/event');
                                            } else if (label === 'TIMELINE') {
                                                navigate('/timeline');
                                            } else if (label === 'ALLIANCES') {
                                                navigate('/alliances');
                                            } else if (label === 'CREW') {
                                                navigate('/crew');
                                            }
                                        }}
                                        className={`nav-link-item${active ? ' nav-link-active' : ''}`}
                                    >
                                        <span className="nav-corner-tl" />
                                        <span className="nav-corner-br" />
                                        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                                    </a>
                                ))}
                            </div>

                            {/* ── Right: Player Status + Register Button (Hidden on mobile/tablet) ── */}
                            <div className="hidden lg:flex flex-col items-end gap-2 font-mono relative z-10">
                                <div className="flex items-center gap-1.5 text-[8.5px] tracking-[0.15em] font-black"
                                    style={{ color: 'rgba(255,46,166,0.9)', textShadow: '0 0 8px rgba(255,46,166,0.5)' }}>
                                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>PLAYER CONNECTING</span>
                                    <span className="animate-pulse" style={{ color: '#FF2EA6', textShadow: '0 0 8px #FF2EA6' }}>....</span>
                                </div>

                                {/* ── REGISTER button — Electric Violet ── */}
                                <div className="reg-btn-wrap">
                                    <button
                                        onClick={setAuthModalOpen ? () => setAuthModalOpen(true) : undefined    }
                                        className="reg-btn group"
                                    >
                                        {/* Border: animated cyan gradient */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                                backgroundSize: '250% 250%',
                                                animation: 'border-flow 2.8s ease infinite',
                                            }}
                                        />
                                        {/* Inner dark base panel */}
                                        <div
                                            className="absolute"
                                            style={{
                                                inset: '1.5px',
                                                clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                                background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                            }}
                                        />
                                        {/* Left-to-right cyan fill wipe on hover */}
                                        <span className="reg-fill" />
                                        {/* Label — always on top */}
                                        <div className="relative z-10 flex items-center gap-2">
                                            <span style={{ color: '#ffffff', textShadow: '0 0 10px rgba(0,217,255,0.8), 0 0 20px rgba(0,217,255,0.4)' }}>CREATE PLAYER</span>
                                            <span
                                                className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold leading-none"
                                                style={{ color: '#00D9FF', textShadow: '0 0 10px #00D9FF' }}
                                            >▶</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* ── Mobile Hamburger Toggle Button (Visible on mobile/tablet) ── */}
                            <div className="flex lg:hidden items-center relative z-10 pointer-events-auto">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    aria-label="Toggle navigation menu"
                                    aria-expanded={isSidebarOpen}
                                    className="relative w-12 h-12 flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-105 active:scale-95"
                                    style={{
                                        background: 'rgba(2, 13, 26, 0.85)',
                                        border: '1.5px solid rgba(0, 217, 255, 0.6)',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 12px rgba(0, 217, 255, 0.45)',
                                        cursor: 'pointer',
                                    }}
                                    title="Toggle Navigation Menu"
                                >
                                    {/* Radar rotating sweep sweep */}
                                    <div className="absolute inset-0.5 rounded-full border border-dashed border-[#00d9ff]/20 animate-spin" style={{ animationDuration: '6s' }} />
                                    
                                    <svg className="w-5 h-5 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        {isSidebarOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>



                <div className="flex-1 flex flex-col items-center justify-start pt-[12vh] relative">
                    {/* Subtitle */}
                    <AnimatePresence>
                        {showLogo && (
                            <motion.div
                                key="subtitle"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="text-center flex flex-col items-center gap-2"
                            >
                                {/* Tiny top micro-label */}
                                <span style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.35em',
                                    color: 'rgba(0,217,255,0.75)',
                                    textTransform: 'uppercase',
                                    userSelect: 'none',
                                    textShadow: '0 0 8px rgba(0,217,255,0.4)',
                                }}>National Institute of Technology</span>

                                {/* Main styled line */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    {/* Left decorative line */}
                                    <div className="hidden sm:block" style={{
                                        width: '48px', height: '1.5px',
                                        background: 'linear-gradient(90deg, transparent, #00D9FF)',
                                        boxShadow: '0 0 6px rgba(0,217,255,0.5)',
                                    }} />

                                    <h2 style={{
                                        fontFamily: "'Orbitron', monospace",
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.38em',
                                        textTransform: 'uppercase',
                                        background: 'linear-gradient(90deg, #67e8f9 0%, #ffffff 45%, #67e8f9 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 0 8px rgba(0,217,255,0.6))',
                                        margin: 0,
                                        userSelect: 'none',
                                    }}>Arunachal Pradesh</h2>

                                    {/* Right decorative line */}
                                    <div className="hidden sm:block" style={{
                                        width: '48px', height: '1.5px',
                                        background: 'linear-gradient(90deg, #00D9FF, transparent)',
                                        boxShadow: '0 0 6px rgba(0,217,255,0.5)',
                                    }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Enter the Arena button */}
                    <AnimatePresence>
                        {showButton && (
                            <motion.div
                                key="enter-btn"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0, ease: 'easeOut' }}
                                className="mt-[36vh] pointer-events-auto transform scale-[0.68] sm:scale-85 md:scale-100 origin-center"
                            >
                                {/* ─── ENTER THE ARENA — Clean Gaming Button ─── */}
                                <button
                                    id="enter-arena-btn"
                                    onClick={handleEnterArena}
                                    className="group relative overflow-hidden cursor-pointer select-none active:scale-95"
                                    style={{
                                        fontFamily: "'Orbitron', monospace",
                                        background: 'transparent',
                                        border: 'none',
                                        padding: 0,
                                        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                >
                                    {/* Outer glowing border layer */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(135deg, #00D9FF 0%, #0891b2 40%, #00D9FF 100%)',
                                        backgroundSize: '200% 200%',
                                        animation: 'border-flow 3s ease infinite',
                                        clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
                                    }} />
                                    {/* Inner dark panel */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: '1.5px',
                                        background: 'linear-gradient(135deg, rgba(2,13,26,0.97) 0%, rgba(4,20,38,0.97) 100%)',
                                        clipPath: 'polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)',
                                    }} />
                                    {/* Left-to-right hover fill wipe */}
                                    <div className="arena-fill" style={{
                                        position: 'absolute',
                                        inset: '1.5px',
                                        background: 'linear-gradient(90deg, rgba(0,217,255,0.18) 0%, rgba(0,240,255,0.07) 100%)',
                                        clipPath: 'polygon(13px 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%, 0 13px)',
                                        transformOrigin: 'left center',
                                        transform: 'scaleX(0)',
                                        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                                        pointerEvents: 'none',
                                    }}
                                        ref={el => {
                                            if (!el) return;
                                            const btn = el.closest('button');
                                            if (btn && !btn._arenaListeners) {
                                                btn._arenaListeners = true;
                                                btn.addEventListener('mouseenter', () => el.style.transform = 'scaleX(1)');
                                                btn.addEventListener('mouseleave', () => el.style.transform = 'scaleX(0)');
                                            }
                                        }}
                                    />
                                    {/* Main content row */}
                                    <div className="arena-btn-content">
                                        {/* Left: mini D-pad */}
                                        <div className="arena-dpad">
                                            <div style={{ position: 'absolute', left: '37.5%', top: 0, width: '25%', height: '100%', background: 'rgba(0,217,255,0.3)', borderRadius: '3px', border: '1px solid rgba(0,217,255,0.5)' }} />
                                            <div style={{ position: 'absolute', top: '37.5%', left: 0, width: '100%', height: '25%', background: 'rgba(0,217,255,0.3)', borderRadius: '3px', border: '1px solid rgba(0,217,255,0.5)' }} />
                                            <div style={{ position: 'absolute', left: '40%', top: '40%', width: '20%', height: '20%', borderRadius: '50%', background: '#00D9FF', boxShadow: '0 0 6px #00D9FF' }} />
                                        </div>

                                        {/* Center: text */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                            <span className="arena-btn-title">ENTER THE ARENA</span>
                                            <span className="arena-btn-subtitle">── PRESS TO START ──</span>
                                        </div>

                                        {/* Right: face buttons △ ○ × □ */}
                                        <div className="arena-face-buttons">
                                            {[
                                                { s: '△', c: '#facc15', d: '0s' },
                                                { s: '○', c: '#FF2EA6', d: '0.8s' },
                                                { s: '□', c: '#4ade80', d: '1.6s' },
                                                { s: '×', c: '#00D9FF', d: '1.2s' },
                                            ].map(({ s, c, d }) => (
                                                <div key={s} className="arena-face-button" style={{
                                                    background: `${c}18`, border: `1.5px solid ${c}`,
                                                    color: c,
                                                    boxShadow: `0 0 7px ${c}80`,
                                                    animation: `dot-blink 2.8s ease-in-out ${d} infinite`,
                                                }}>{s}</div>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Racing Car / Spaceship Driver POV Cockpit HUD Overlay ── */}
            <AnimatePresence>
                {!isEventPage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                    >
                        {/* 1. Subtle Diagonal Windshield Glass Sheen Reflection */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.035] bg-gradient-to-tr from-transparent via-white to-transparent"
                            style={{ mixBlendMode: 'overlay' }}
                        />

                        {/* 2. Symmetrical Side pillars (A-Pillars) & Top Bar of windshield */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-[#030612]/95 border-b border-[#00f0ff]/10" />

                        {/* Left Windshield A-pillar structural frame */}
                        <div
                            className="absolute top-0 left-0 h-full w-[4%] bg-gradient-to-r from-[#030612]/90 to-transparent border-r border-[#00f0ff]/10"
                            style={{ clipPath: 'polygon(0 0, 100% 0, 30% 100%, 0 100%)' }}
                        />
                        {/* Right Windshield A-pillar structural frame */}
                        <div
                            className="absolute top-0 right-0 h-full w-[4%] bg-gradient-to-l from-[#030612]/90 to-transparent border-l border-[#ff1f4f]/10"
                            style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 0 100%)' }}
                        />

                        {/* Centered Dashboard Visor & Tab Controls Wrapper */}
                        <div className="absolute bottom-0 left-0 right-0 w-full flex flex-col items-center pointer-events-none z-30">
                            {/* 4. Clickable Steering Wheel top rim arch peeking just above the dashboard */}
                            <motion.div
                                onClick={() => setIsFooterOpen(v => !v)}
                                animate={{
                                    y: isFooterOpen ? 'calc(-50vh + 48px)' : '0px',
                                }}
                                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="w-28 h-7 bg-[#040815]/95 border-t border-r border-l border-[#00f0ff]/40 rounded-t-full shadow-[0_-4px_12px_rgba(0,0,0,0.6)] cursor-pointer hover:bg-[#09182d] pointer-events-auto flex items-center justify-center transition-all duration-300 relative z-30"
                                style={{
                                    clipPath: 'polygon(0 30%, 100% 30%, 100% 100%, 0 100%)',
                                    marginBottom: '-1px',
                                }}
                                title={isFooterOpen ? 'Close Connect Hub' : 'Open Connect Hub'}
                            >
                                <span style={{
                                    color: '#00f0ff',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    transform: isFooterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    textShadow: '0 0 8px rgba(0, 217, 255, 0.8)',
                                }}>▲</span>
                            </motion.div>

                            {/* 5. Center Dashboard Telemetry Visor Console at the bottom */}
                            <motion.div
                                animate={{
                                    y: isFooterOpen ? '100%' : '0%',
                                    opacity: isFooterOpen ? 0 : 1,
                                }}
                                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="w-[92%] sm:w-[75%] md:w-[55%] h-12 bg-[#040815]/90 border-t border-[#00f0ff]/20 flex justify-center md:justify-between items-center px-4 md:px-8 text-white font-mono text-[9px] tracking-widest pointer-events-auto relative z-20"
                                style={{
                                    clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 100%, 0 100%)',
                                    boxShadow: 'inset 0 10px 20px rgba(0, 240, 255, 0.05), 0 -10px 30px rgba(0, 240, 255, 0.08)',
                                }}
                            >
                                {/* Left Dials (Gear and RPM) - Hidden on mobile */}
                                <div className="hidden md:flex items-center space-x-4 text-[#00f0ff]/70">
                                    <div>
                                        <span className="text-gray-500 mr-2 text-[8px]">GEAR</span>
                                        <span className="font-extrabold text-white text-xs">06</span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-gray-800" />
                                    <div>
                                        <span className="text-gray-500 mr-2 text-[8px]">RPM</span>
                                        <span className="font-extrabold text-[#00d9ff] text-xs">11.4K</span>
                                    </div>
                                </div>

                                {/* Center countdown timer */}
                                <div className="text-center flex flex-col items-center justify-center leading-none">
                                    <span className="text-gray-500 text-[6px] tracking-[0.2em] uppercase mb-0.5" style={{ fontSize: '6px' }}>EVENT COUNTDOWN</span>
                                    <span className="text-[#00f0ff] font-extrabold text-[10px] tracking-[0.05em] font-mono flex gap-1" style={{ textShadow: '0 0 8px rgba(0,240,255,0.8)' }}>
                                        <span>{String(timeLeft.days).padStart(2, '0')}d</span>
                                        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                                        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                                        <span className="text-[#FF2EA6]" style={{ textShadow: '0 0 8px rgba(255,46,166,0.8)' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                                    </span>
                                </div>

                                {/* Right Dials (Dynamic direct-DOM speedometer) - Hidden on mobile */}
                                <div className="hidden md:flex items-center space-x-2 text-[#ff1f4f]/80">
                                    <span className="text-gray-500 text-[8px] mr-1">VELOCITY</span>
                                    <span id="cockpit-speedometer" className="font-extrabold text-white text-xs font-mono min-w-[70px] text-right">
                                        0 KM/H
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Inline Keyframes styles */}
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes scroll-grid-back {
                                0% { background-position: 0 0; }
                                100% { background-position: 0 16px; }
                            }
                        `}} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop click-catcher for Connect Hub Footer */}
            <AnimatePresence>
                {!isEventPage && isFooterOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        onClick={() => setIsFooterOpen(false)}
                        className="fixed inset-0 bg-[#02060c]/40 backdrop-blur-[1.5px] z-10 pointer-events-auto"
                    />
                )}
            </AnimatePresence>

            {/* ── Connect Hub Slide-Up Footer Panel (50% Height) ── */}
            <AnimatePresence>
                {!isEventPage && isFooterOpen && (
                    <motion.div
                        key="connect-hub"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 right-0 z-20 pointer-events-auto"
                        style={{
                            bottom: 0,
                            height: '50vh',
                            background: 'linear-gradient(180deg, rgba(2,8,20,0.98) 0%, rgba(1,5,15,0.99) 100%)',
                            boxShadow: '0 -15px 40px rgba(0,217,255,0.15)',
                            backdropFilter: 'blur(16px)',
                        }}
                    >
                        {/* Thinner glowing neon gradient border line at the top */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 5%, #00D9FF 20%, #A855F7 50%, #00D9FF 80%, transparent 95%)',
                            boxShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 4px rgba(168, 85, 247, 0.6)',
                            zIndex: 10,
                        }} />

                        {/* Scanline overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,217,255,0.015) 0px, rgba(0,217,255,0.015) 1px, transparent 1px, transparent 4px)',
                        }} />

                        <div className="relative h-full flex flex-col px-12 py-6 gap-6 overflow-y-auto no-scrollbar">
                            {/* Header */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#00D9FF]" style={{ boxShadow: '0 0 6px rgba(0,217,255,0.5)' }} />
                                <h2 style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.4em',
                                    color: '#00f0ff', textShadow: '0 0 16px rgba(0,240,255,0.6)',
                                    textTransform: 'uppercase', margin: 0,
                                }}>CONNECT HUB</h2>
                                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#00D9FF] to-transparent" style={{ boxShadow: '0 0 6px rgba(0,217,255,0.5)' }} />
                            </div>

                            {/* Main grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                {/* Col 1: Location & Map */}
                                <div className="flex flex-col gap-3 min-h-0">
                                    <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', letterSpacing: '0.35em', color: 'rgba(0,217,255,0.6)', textTransform: 'uppercase', margin: 0 }}>📍 LOCATION</h3>
                                    <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(0,217,255,0.2)', height: '120px', minHeight: '120px' }}>
                                        <iframe
                                            title="NIT Arunachal Pradesh Map"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.1!2d94.0!3d27.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3742bfb9f0b5a0b7%3A0x6b9a17c1d7b3e5f0!2sNIT%20Arunachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
                                            width="100%" height="100%"
                                            style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) saturate(1.5)' }}
                                            allowFullScreen loading="lazy"
                                        />
                                    </div>
                                    <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>
                                        Yupia, Papum Pare, Arunachal Pradesh – 791112
                                    </p>
                                </div>

                                {/* Col 2: Contact Info */}
                                <div className="flex flex-col gap-4">
                                    <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', letterSpacing: '0.35em', color: 'rgba(0,217,255,0.6)', textTransform: 'uppercase', margin: 0 }}>📡 CONTACT HUB</h3>
                                    {[
                                        { label: 'GENERAL INQUIRIES', value: '+91 98765 43210', icon: (
                                            <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        ) },
                                        { label: 'EVENT COORDINATION', value: '+91 91234 56789', icon: (
                                            <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        ) },
                                        { label: 'EMAIL ADDRESS', value: 'addovedi@nitap.ac.in', icon: (
                                            <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        ) },
                                        { label: 'OFFICIAL PORTAL', value: 'addovedi.nitap.ac.in', icon: (
                                            <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        ) },
                                    ].map(({ label, value, icon }) => (
                                        <div key={label} className="flex items-start gap-3">
                                            <div className="p-1.5 bg-[#00D9FF]/10 rounded border border-[#00D9FF]/20">
                                                {icon}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.62rem', color: 'rgba(0,217,255,0.5)', letterSpacing: '0.3em', marginBottom: '2px' }}>{label}</div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Col 3: Social & Event Info */}
                                <div className="flex flex-col gap-4">
                                    <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', letterSpacing: '0.35em', color: 'rgba(0,217,255,0.6)', textTransform: 'uppercase', margin: 0 }}>⚡ CONNECT TRANSMISSION</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'INSTAGRAM', handle: '@addovedi_nitap', color: '#FF2EA6', icon: (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                                                </svg>
                                            ) },
                                            { label: 'YOUTUBE', handle: 'Addovedi Official', color: '#facc15', icon: (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 00-1.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                                                </svg>
                                            ) },
                                            { label: 'FACEBOOK', handle: 'Addovedi NITAP', color: '#4ade80', icon: (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                                </svg>
                                            ) },
                                            { label: 'LINKEDIN', handle: 'NITAP Addovedi', color: '#00D9FF', icon: (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                                    <circle cx="4" cy="4" r="2" />
                                                </svg>
                                            ) },
                                        ].map(({ label, handle, color, icon }) => (
                                            <a
                                                key={label}
                                                href="#"
                                                className="flex flex-col p-2 rounded border border-transparent hover:border-[#00D9FF]/20 hover:bg-[#00D9FF]/5 transition-all text-left"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div style={{ color, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                    {icon}
                                                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', letterSpacing: '0.15em' }}>{label}</span>
                                                </div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{handle}</div>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Event countdown badge */}
                                    <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgba(0,217,255,0.1)' }}>
                                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.62rem', color: 'rgba(0,217,255,0.5)', letterSpacing: '0.3em', marginBottom: '2px' }}>EVENT TIMELINE</div>
                                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.88rem', fontWeight: 800, color: '#FF2EA6', textShadow: '0 0 12px rgba(255,46,166,0.6)' }}>SEP 12 – 14, 2026</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom copyright */}
                            <div className="shrink-0" style={{ borderTop: '1px solid rgba(0,217,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.25em' }}>
                                    © 2026 ADDOVEDI · NIT ARUNACHAL PRADESH
                                </span>
                                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: 'rgba(0,217,255,0.4)', letterSpacing: '0.3em' }}>v2.6.0</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
