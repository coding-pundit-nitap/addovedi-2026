import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function HeroOverlay() {
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
    const showLogo   = useStore(s => s.showLogo);
    const showNavbar = useStore(s => s.showNavbar);
    const showButton = useStore(s => s.showButton);
    const isEventPage = useStore(s => s.isEventPage);

    const setIsEntered   = useStore(s => s.setIsEntered);
    const setShowButton  = useStore(s => s.setShowButton);
    const setShowLogo    = useStore(s => s.setShowLogo);
    const setShowNavbar  = useStore(s => s.setShowNavbar);

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
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none p-6 font-sans">

                {/* Navbar */}
                <AnimatePresence>
                    {showNavbar && (
                        <motion.nav
                            key="navbar"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="w-full max-w-7xl mx-auto h-[95px] flex items-center justify-between text-white pointer-events-auto px-12 relative overflow-visible"
                        >

                            {/* Left Side: Brand Logo block */}
                            <div className="flex items-center gap-3 font-mono relative z-10 pl-2">
                                <div className="relative">
                                    <svg className="w-12 h-12 text-[#00D9FF] filter drop-shadow-[0_0_4px_rgba(0,217,255,0.4)]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" />
                                        <circle cx="50" cy="50" r="32" strokeWidth="1" />
                                        <circle cx="50" cy="50" r="24" strokeWidth="1.5" strokeDasharray="10 5" />
                                        <circle cx="50" cy="50" r="14" strokeWidth="1.2" />
                                        <path d="M 50 14 L 50 24 M 50 76 L 50 86 M 14 50 L 24 50 M 76 50 L 86 50" strokeWidth="1.5" />
                                        <circle cx="50" cy="50" r="4.5" fill="#00D9FF" />
                                    </svg>
                                    <div className="absolute inset-0 bg-[#00D9FF]/5 rounded-full blur-md" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1.5 leading-none">
                                        <span className="font-black text-xl tracking-[0.2em] text-[#00D9FF]">ADDOVEDI</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 leading-none">
                                        <span className="text-[#FF2EA6] text-xs font-black tracking-widest">2026</span>
                                    </div>
                                    <div className="w-24 h-[1px] bg-white/10 my-1" />
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                                        <span className="text-[7.5px] text-[#00D9FF] tracking-widest uppercase font-bold">SYSTEM ONLINE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center Navigation Links */}
                            <div className="flex items-center gap-2.5 relative z-10">
                                {['HOME', 'ARENA', 'TIMELINE', 'ALLIANCES', 'CONNECT HUB'].map((item) => {
                                    const isHome = item === 'Home'; // Standard active representation inside Hero
                                    return (
                                        <a
                                            key={item}
                                            href="#"
                                            className={`font-mono text-xs uppercase tracking-[0.25em] relative py-2.5 px-6 transition-all duration-300 ${
                                                isHome ? 'text-[#00D9FF] font-black' : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {isHome && (
                                                <>
                                                    {/* Target bracket outlines */}
                                                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00D9FF]" />
                                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#00D9FF]" />
                                                    {/* Glowing underline */}
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]" />
                                                </>
                                            )}
                                            <span>{item}</span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Right Side: Player Status & Register Button */}
                            <div className="flex flex-col items-end gap-1.5 font-mono relative z-10 pr-2">
                                <div className="flex items-center gap-1.5 text-[8.5px] text-[#FF2EA6]/85 tracking-[0.15em] font-black">
                                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>PLAYER CONNECTING</span>
                                    <span className="text-[#FF2EA6] animate-pulse">....</span>
                                </div>

                                {/* Custom bevel cut buttons using double layer clipping */}
                                <button 
                                    onClick={handleEnterArena}
                                    className="relative px-7 py-2.5 text-xs font-black tracking-[0.25em] text-white uppercase transition-all duration-300 group overflow-hidden"
                                    style={{
                                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                                    }}
                                >
                                    {/* Glowing gradient background border */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2EA6] to-[#00D9FF] opacity-60 group-hover:opacity-100 transition-all duration-300" />
                                    {/* Inner dark center panel */}
                                    <div className="absolute inset-[1.5px] bg-[#02060c]" style={{ clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)' }} />
                                    
                                    <div className="relative z-10 flex items-center gap-2">
                                        <span>REGISTER</span>
                                        <span className="text-[#FF2EA6] group-hover:translate-x-1 transition-transform duration-300 font-bold leading-none">&gt;</span>
                                    </div>
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="text-center mix-blend-overlay"
                            >
                                <motion.h2
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 0.7, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-gray-300 tracking-[0.5em] uppercase text-xs mb-6"
                                >
                                    NIT Arunachal Pradesh
                                </motion.h2>
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
                                className="mt-[44vh] pointer-events-auto"
                            >
                                <button
                                    id="enter-arena-btn"
                                    onClick={handleEnterArena}
                                    className="relative px-16 py-4 bg-[#0a1120]/80 text-[#00f0ff] hover:text-white tracking-[0.3em] font-extrabold uppercase transition-all duration-300 text-lg border border-[#00f0ff]/40 overflow-hidden group transform hover:scale-105 active:scale-95 hover:bg-[#00f0ff]/15 hover:border-[#00f0ff]/80"
                                    style={{
                                        clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                                        textShadow: '0 0 10px rgba(0,240,255,0.6)',
                                        boxShadow: 'inset 0 0 20px rgba(0,240,255,0.2), 0 0 15px rgba(0,240,255,0.1)',
                                    }}
                                >
                                    {/* Corner bracket highlights */}
                                    <span className="absolute top-0 left-0 w-3 h-[2px] bg-[#00f0ff] group-hover:w-6 transition-all duration-300" />
                                    <span className="absolute top-0 left-0 w-[2px] h-3 bg-[#00f0ff] group-hover:h-6 transition-all duration-300" />
                                    <span className="absolute bottom-0 right-0 w-3 h-[2px] bg-[#00f0ff] group-hover:w-6 transition-all duration-300" />
                                    <span className="absolute bottom-0 right-0 w-[2px] h-3 bg-[#00f0ff] group-hover:h-6 transition-all duration-300" />
                                    
                                    {/* Angled border cut guides */}
                                    <span className="absolute top-0 right-0 w-[12px] h-[2px] bg-[#00f0ff]/40" />
                                    <span className="absolute bottom-0 left-0 w-[12px] h-[2px] bg-[#00f0ff]/40" />

                                    {/* Cyber visors HUD decalls */}
                                    <span className="absolute top-[2px] right-4 text-[7px] tracking-normal text-[#00f0ff]/40 font-mono">SYS.PRTL_v2.6</span>
                                    <span className="absolute bottom-[2px] left-4 text-[7px] tracking-normal text-[#00f0ff]/40 font-mono">SYS_READY</span>

                                    {/* Glitch sweep laser bar */}
                                    <span className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent -translate-x-16 group-hover:translate-x-[400px] transition-transform duration-1000 ease-out" />
                                    
                                    <span className="relative z-10">ENTER THE ARENA</span>
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

                        {/* 4. Steering Wheel top rim arch peeking just above the dashboard */}
                        <div 
                            className="absolute bottom-11 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#030612] border-t-2 border-r-2 border-l-2 border-[#1e293b]/60 rounded-t-full shadow-[0_-4px_10px_rgba(0,0,0,0.5)]"
                            style={{
                                clipPath: 'polygon(0 40%, 100% 40%, 100% 100%, 0 100%)'
                            }}
                        />

                        {/* 5. Center Dashboard Telemetry Visor Console at the bottom */}
                        <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-12 bg-[#040815]/90 border-t border-[#00f0ff]/20 flex justify-between items-center px-8 text-white font-mono text-[9px] tracking-widest"
                            style={{
                                clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 100%, 0 100%)',
                                boxShadow: 'inset 0 10px 20px rgba(0, 240, 255, 0.05), 0 -10px 30px rgba(0, 240, 255, 0.08)'
                            }}
                        >
                            {/* Left Dials (Gear and RPM) */}
                            <div className="flex items-center space-x-4 text-[#00f0ff]/70">
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

                            {/* Center diagnostic message */}
                            <div className="text-center">
                                <span className="text-[#00f0ff] animate-pulse text-[9px] font-bold font-sans tracking-[0.25em]">
                                    PRTL_ENG.SYS_OK
                                </span>
                            </div>

                            {/* Right Dials (Dynamic direct-DOM speedometer) */}
                            <div className="flex items-center space-x-2 text-[#ff1f4f]/80">
                                <span className="text-gray-500 text-[8px] mr-1">VELOCITY</span>
                                <span id="cockpit-speedometer" className="font-extrabold text-white text-xs font-mono min-w-[70px] text-right">
                                    0 KM/H
                                </span>
                            </div>
                        </div>

                        {/* Inline Keyframes styles */}
                        <style dangerouslySetInnerHTML={{__html: `
                            @keyframes scroll-grid-back {
                                0% { background-position: 0 0; }
                                100% { background-position: 0 16px; }
                            }
                        `}} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
