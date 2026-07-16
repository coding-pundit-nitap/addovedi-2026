/**
 * TimelineNav.jsx
 *
 * Standalone navbar for /timeline — mirrors the exact look of the
 * HeroOverlay navbar (scanline bg, Orbitron font, corner-bracket nav
 * links, cyan glows) with TIMELINE set as the active item.
 *
 * Desktop: horizontal bar  |  Mobile: hamburger → sliding right drawer
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
    { label: 'HOME',        path: '/home' },
    { label: 'ARENA',       path: '/event' },
    { label: 'TIMELINE',    path: '/timeline' },
    { label: 'ALLIANCES',   path: null },
    { label: 'CREW',        path: null },
    { label: 'CONNECT HUB', path: null },
];

/* ─── Shared CSS injected once ─── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap');

@keyframes tl-nav-scanline {
    0%   { background-position: 0 0; }
    100% { background-position: 0 4px; }
}
@keyframes tl-glow-pulse {
    0%,100% { opacity:.75; filter:drop-shadow(0 0 6px #00D9FF); }
    50%      { opacity:1;   filter:drop-shadow(0 0 14px #00D9FF) drop-shadow(0 0 28px #00D9FF); }
}
@keyframes tl-cyan-pulse {
    0%,100% { box-shadow: 0 0 14px rgba(0,217,255,.3), 0 0 28px rgba(0,217,255,.12); }
    50%      { box-shadow: 0 0 26px rgba(0,217,255,.6), 0 0 50px rgba(0,217,255,.25); }
}

/* Desktop nav link */
.tl-nav-link {
    position: relative;
    font-family: 'Orbitron', monospace;
    font-size: .67rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(180,210,255,.5);
    padding: 10px 18px;
    transition: color .25s ease;
    cursor: pointer;
    text-decoration: none;
}
.tl-nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,rgba(0,217,255,.05),rgba(168,85,247,.05));
    opacity: 0;
    transition: opacity .3s;
}
.tl-nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 70%; height: 2px;
    background: linear-gradient(90deg,#00D9FF,#A855F7);
    border-radius: 2px;
    box-shadow: 0 0 8px #00D9FF,0 0 16px rgba(168,85,247,.4);
    transition: transform .3s cubic-bezier(.34,1.56,.64,1);
}
.tl-nav-link:hover           { color:#fff; text-shadow:0 0 10px rgba(0,217,255,.8),0 0 22px rgba(0,217,255,.3); }
.tl-nav-link:hover::before   { opacity:1; }
.tl-nav-link:hover::after    { transform:translateX(-50%) scaleX(1); }

.tl-nav-active {
    color: #00D9FF !important;
    text-shadow: 0 0 10px #00D9FF,0 0 22px rgba(0,217,255,.6) !important;
}
.tl-nav-active::after {
    transform: translateX(-50%) scaleX(1) !important;
    background: #00D9FF !important;
    box-shadow: 0 0 10px #00D9FF,0 0 20px rgba(0,217,255,.6) !important;
}
.tl-nav-active .tl-corner-tl,
.tl-nav-active .tl-corner-br { opacity:1 !important; }

.tl-corner-tl, .tl-corner-br {
    position: absolute;
    width: 7px; height: 7px;
    opacity: 0;
    transition: opacity .3s;
}
.tl-corner-tl { top:5px;    left:10px;  border-top:1.5px solid #00D9FF; border-left:1.5px solid #00D9FF;   box-shadow:-1px -1px 6px rgba(0,217,255,.5); }
.tl-corner-br { bottom:5px; right:10px; border-bottom:1.5px solid #A855F7; border-right:1.5px solid #A855F7; box-shadow:1px 1px 6px rgba(168,85,247,.5); }

/* Mobile sidebar link */
.tl-mob-link {
    position: relative;
    font-family: 'Orbitron', monospace;
    font-size: .72rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(180,210,255,.55);
    padding: 12px 20px;
    border-left: 2.5px solid transparent;
    background: rgba(0,217,255,.02);
    margin-bottom: 4px;
    transition: all .3s;
    cursor: pointer;
    text-decoration: none;
    display: block;
}
.tl-mob-link:hover {
    color: #00D9FF;
    background: rgba(0,217,255,.08);
    border-left: 2.5px solid rgba(0,217,255,.7);
    text-shadow: 0 0 8px rgba(0,217,255,.6);
}
.tl-mob-active {
    color: #00D9FF !important;
    background: rgba(0,217,255,.12) !important;
    border-left: 2.5px solid #00D9FF !important;
    text-shadow: 0 0 10px #00D9FF !important;
    box-shadow: inset 4px 0 12px rgba(0,217,255,.05);
}
`;

export default function TimelineNav() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNav = (path) => {
        setSidebarOpen(false);
        if (path) navigate(path);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />

            {/* ── Desktop / Tablet Navbar ── */}
            <nav
                style={{
                    position: 'relative',
                    zIndex: 20,
                    width: '100%',
                    height: '88px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 clamp(12px, 4vw, 40px)',
                    pointerEvents: 'auto',
                }}
            >
                {/* Scanline strip */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(180deg,rgba(0,217,255,.04) 0%,rgba(2,6,12,.55) 60%,rgba(0,217,255,.025) 100%)',
                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,217,255,.025) 3px,rgba(0,217,255,.025) 4px)',
                    animation: 'tl-nav-scanline .3s linear infinite',
                }} />

                {/* ── Logo ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'monospace', position: 'relative', zIndex: 10 }}>
                    <div style={{ position: 'relative', animation: 'tl-glow-pulse 2.8s ease-in-out infinite' }}>
                        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" stroke="#00D9FF">
                            <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" />
                            <circle cx="50" cy="50" r="32" strokeWidth="1" />
                            <circle cx="50" cy="50" r="24" strokeWidth="1.5" strokeDasharray="10 5" />
                            <circle cx="50" cy="50" r="14" strokeWidth="1.2" />
                            <path d="M50 14L50 24M50 76L50 86M14 50L24 50M76 50L86 50" strokeWidth="1.5" />
                            <circle cx="50" cy="50" r="4.5" fill="#00D9FF" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,217,255,.1)', borderRadius: '50%', filter: 'blur(10px)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontFamily: "'Orbitron',monospace", fontWeight: 900,
                            fontSize: '1.15rem', letterSpacing: '.25em',
                            background: 'linear-gradient(90deg,#00D9FF 0%,#a8f0ff 50%,#00D9FF 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 10px rgba(0,217,255,.7))',
                        }}>ADDOVEDI</span>
                        <span style={{
                            fontSize: '.75rem', fontWeight: 900, letterSpacing: '.25em',
                            background: 'linear-gradient(90deg,#FF2EA6,#ff85cc)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 6px rgba(255,46,166,.6))',
                        }}>2026</span>
                        <div style={{ width: '96px', height: '1px', margin: '2px 0', background: 'linear-gradient(90deg,rgba(0,217,255,.4),transparent)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D9FF', boxShadow: '0 0 6px #00D9FF', animation: 'tl-cyan-pulse 2s ease-in-out infinite', display: 'inline-block' }} />
                            <span style={{ fontSize: '7.5px', color: '#00D9FF', letterSpacing: '.25em', textShadow: '0 0 8px rgba(0,217,255,.7)', fontFamily: 'monospace', fontWeight: 700 }}>SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* ── Desktop Nav Links (lg+) ── */}
                <div className="hidden lg:flex" style={{ alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    {NAV_LINKS.map(({ label, path }) => {
                        const isActive = label === 'TIMELINE';
                        return (
                            <a
                                key={label}
                                href="#"
                                onClick={e => { e.preventDefault(); handleNav(path); }}
                                className={`tl-nav-link${isActive ? ' tl-nav-active' : ''}`}
                            >
                                <span className="tl-corner-tl" />
                                <span className="tl-corner-br" />
                                <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                            </a>
                        );
                    })}
                </div>

                {/* ── Desktop Right: Status ── */}
                <div className="hidden lg:flex" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '8px', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8.5px', letterSpacing: '.15em', fontWeight: 900, color: 'rgba(255,46,166,.9)', textShadow: '0 0 8px rgba(255,46,166,.5)', fontFamily: 'monospace' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>PLAYER CONNECTING</span>
                        <span style={{ animation: 'tl-glow-pulse 1.2s ease-in-out infinite', color: '#FF2EA6' }}>...</span>
                    </div>
                    {/* Mission route badge */}
                    <div style={{
                        fontFamily: "'Orbitron',monospace", fontSize: '7px', letterSpacing: '.3em',
                        padding: '4px 12px',
                        border: '1px solid rgba(0,229,255,.25)',
                        borderRadius: '4px',
                        color: '#00E5FF',
                        background: 'rgba(0,229,255,.05)',
                        boxShadow: '0 0 8px rgba(0,229,255,.15)',
                    }}>
                        MISSION CONTROL // ACTIVE
                    </div>
                </div>

                {/* ── Mobile Hamburger ── */}
                <div className="flex lg:hidden" style={{ alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <button
                        onClick={() => setSidebarOpen(v => !v)}
                        aria-label="Toggle navigation"
                        style={{
                            width: '48px', height: '48px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(2,13,26,.85)',
                            border: '1.5px solid rgba(0,217,255,.6)',
                            borderRadius: '50%',
                            boxShadow: '0 0 12px rgba(0,217,255,.45)',
                            cursor: 'pointer', position: 'relative',
                        }}
                    >
                        <div style={{ position: 'absolute', inset: '3px', borderRadius: '50%', border: '1px dashed rgba(0,217,255,.2)', animation: 'spin 6s linear infinite' }} />
                        <svg width="20" height="20" stroke="#00D9FF" strokeWidth="2.5" fill="none" viewBox="0 0 24 24">
                            {sidebarOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* ── Mobile Sidebar Drawer ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="tl-backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 40 }}
                            className="lg:hidden"
                        />

                        {/* Drawer panel */}
                        <motion.div
                            key="tl-drawer"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="lg:hidden"
                            style={{
                                position: 'fixed', top: '96px', right: '16px', bottom: '80px',
                                width: '290px', zIndex: 50,
                                display: 'flex', flexDirection: 'column',
                                padding: '24px', gap: '24px',
                                background: '#000000',
                                border: '1.5px solid rgba(0,217,255,.5)',
                                backdropFilter: 'blur(16px)',
                                clipPath: 'polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px)',
                                boxShadow: '0 0 30px rgba(0,217,255,.25)',
                                overflowY: 'auto',
                            }}
                        >
                            {/* Grid bg */}
                            <div style={{
                                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .15,
                                backgroundImage: 'linear-gradient(rgba(0,217,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,217,255,.2) 1px,transparent 1px)',
                                backgroundSize: '16px 16px',
                            }} />

                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,.15)', paddingBottom: '16px', position: 'relative', zIndex: 10 }}>
                                <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: '.82rem', letterSpacing: '.25em', color: '#00D9FF', textShadow: '0 0 10px rgba(0,217,255,.7)' }}>
                                    NAVIGATION MENU
                                </span>
                                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.5)', fontSize: '13px' }}>✕</button>
                            </div>

                            {/* Links */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 10 }}>
                                {NAV_LINKS.map(({ label, path }) => {
                                    const isActive = label === 'TIMELINE';
                                    return (
                                        <a
                                            key={label}
                                            href="#"
                                            onClick={e => { e.preventDefault(); handleNav(path); }}
                                            className={`tl-mob-link${isActive ? ' tl-mob-active' : ''}`}
                                        >
                                            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Bottom status */}
                            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,240,255,.15)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7.5px', letterSpacing: '.2em', fontWeight: 900, color: '#FF2EA6', textShadow: '0 0 8px rgba(255,46,166,.5)', fontFamily: 'monospace' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2EA6', animation: 'tl-cyan-pulse 1.5s ease-in-out infinite', display: 'inline-block' }} />
                                    PLAYER CONNECTING...
                                </div>
                                <div style={{
                                    fontFamily: "'Orbitron',monospace", fontSize: '7px', letterSpacing: '.25em',
                                    padding: '8px 14px', border: '1px solid rgba(0,229,255,.2)',
                                    borderRadius: '4px', color: '#00E5FF',
                                    background: 'rgba(0,229,255,.05)',
                                    textAlign: 'center',
                                }}>
                                    MISSION CONTROL // ACTIVE
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
