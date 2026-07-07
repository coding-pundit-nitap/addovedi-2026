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
                            className="w-full flex justify-between items-center text-white pointer-events-auto px-12 py-4"
                        >
                            <div className="font-bold text-2xl tracking-widest flex items-center gap-4">
                                <span className="text-[#00D9FF]">ADDOVEDI</span>
                                <span className="text-[#FF2EA6] text-sm">2026</span>
                            </div>
                            <div className="flex gap-12 text-sm font-semibold uppercase tracking-widest">
                                {['Home', 'Events', 'Schedule', 'Sponsors'].map(item => (
                                    <a key={item} href="#" className="hover:text-[#00D9FF] transition-all hover:scale-110">
                                        {item}
                                    </a>
                                ))}
                            </div>
                            <button className="border-2 border-[#FF2EA6] text-white px-8 py-2 rounded-xl bg-[#FF2EA6]/10 hover:bg-[#FF2EA6] transition-all shadow-[0_0_20px_rgba(255,46,166,0.3)] hover:shadow-[0_0_30px_rgba(255,46,166,0.7)] tracking-widest font-bold">
                                REGISTER
                            </button>
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
                                    
                                    <span className="relative z-10">ENTER THE PORTAL</span>
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
