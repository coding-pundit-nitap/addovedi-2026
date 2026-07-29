import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap');

@keyframes border-flow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
@keyframes cyan-pulse {
    0%, 100% { box-shadow: 0 0 14px rgba(0,217,255,0.35), 0 0 28px rgba(0,217,255,0.15); }
    50%       { box-shadow: 0 0 26px rgba(0,217,255,0.65), 0 0 50px rgba(0,217,255,0.3); }
}

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
`;

export default function CommonSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isSidebarOpen = useStore(s => s.isSidebarOpen);
    const setIsSidebarOpen = useStore(s => s.setIsSidebarOpen);
    const setIsEntered = useStore(s => s.setIsEntered);
    const setIsEventPage = useStore(s => s.setIsEventPage);
    const setShowButton = useStore(s => s.setShowButton);
    const setShowLogo = useStore(s => s.setShowLogo);
    const setShowNavbar = useStore(s => s.setShowNavbar);
    const isAuthModalOpen = useStore(s => s.isAuthModalOpen);

    const activePath = location.pathname.startsWith('/event') ? '/event' : location.pathname;

    const NAV_LINKS = [
        { label: 'HOME',        path: '/home' },
        { label: 'ARENA',       path: '/event' },
        { label: 'TIMELINE',    path: '/timeline' },
        { label: 'ALLIANCES',   path: '/alliances' },
        { label: 'CREW',        path: '/crew' },
        { label: 'CONNECT HUB', path: '/connect' },
    ];

    const handleNavigation = (label, path) => {
        setIsSidebarOpen(false);
        if (label === 'HOME') {
            setIsEntered(false);
            setIsEventPage(false);
            setShowButton(true);
            setShowLogo(true);
            setShowNavbar(true);
            navigate('/home');
        } else if (label === 'ARENA') {
            setIsEntered(true);
            setIsEventPage(true);
            setShowButton(false);
            setShowLogo(false);
            setShowNavbar(false);
            navigate('/event');
        } else {
            navigate(path);
        }
    };

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <style dangerouslySetInnerHTML={{ __html: STYLES }} />
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1.0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-[#000000]/80 z-[9990] pointer-events-auto lg:hidden"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />

                    {/* Floating Cyber Holographic Sidebar panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed top-24 right-4 bottom-20 w-[290px] z-[9995] pointer-events-auto flex flex-col p-6 gap-6 shadow-[0_0_30px_rgba(0,217,255,0.25)] lg:hidden overflow-y-auto scrollbar-none"
                        style={{
                            background: '#000000',
                            border: '1.5px solid rgba(0, 217, 255, 0.5)',
                            backdropFilter: 'blur(16px)',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                        }}
                    >
                        {/* Holographic grid scanline bg */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{
                            backgroundImage: 'linear-gradient(rgba(0,217,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.2) 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                        }} />

                        {/* Header / Brand */}
                        <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-4 relative z-10">
                            <span style={{
                                fontFamily: "'Orbitron', monospace",
                                fontWeight: 900,
                                fontSize: '0.82rem',
                                letterSpacing: '0.25em',
                                color: '#00D9FF',
                                textShadow: '0 0 10px rgba(0,217,255,0.7)',
                            }}>NAVIGATION MENU</span>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                aria-label="Close navigation menu"
                                className="text-gray-400 hover:text-white transition-colors"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Sidebar Links */}
                        <div className="flex flex-col gap-2 relative z-10">
                            {NAV_LINKS.map(({ label, path }) => {
                                const isActive = activePath === path;
                                return (
                                    <a
                                        key={label}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation(label, path);
                                        }}
                                        className={`mobile-nav-link${isActive ? ' mobile-nav-link-active' : ''}`}
                                    >
                                        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Bottom segment of sidebar: status */}
                        <div className="mt-auto border-t border-[#00f0ff]/15 pt-6 flex flex-col gap-5 relative z-10">
                            <div className="flex items-center gap-2 text-[7.5px] tracking-widest font-black text-[#FF2EA6]" style={{ textShadow: '0 0 8px rgba(255,46,166,0.5)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2EA6] animate-pulse" style={{ boxShadow: '0 0 6px #FF2EA6' }} />
                                <span>{localStorage.getItem('addovedi_user') ? 'PLAYER ACTIVE' : 'PLAYER CONNECTING...'}</span>
                            </div>
                            <div className="reg-btn-wrap w-full">
                                <button
                                    onClick={() => {
                                        setIsSidebarOpen(false);
                                        useStore.getState().setAuthModalOpen(true);
                                    }}
                                    className="reg-btn group w-full text-center flex justify-center items-center py-3.5 relative"
                                    style={{ cursor: 'pointer' }}
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
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <span style={{ color: '#ffffff', textShadow: '0 0 10px rgba(0,217,255,0.8), 0 0 20px rgba(0,217,255,0.4)', fontFamily: "'Orbitron', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em' }}>
                                            {localStorage.getItem('addovedi_user') ? 'PLAYER HQ' : 'CREATE PLAYER'}
                                        </span>
                                        <span
                                            className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold leading-none"
                                            style={{ color: '#00D9FF', textShadow: '0 0 10px #00D9FF' }}
                                        >▶</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
