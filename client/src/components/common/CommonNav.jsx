import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const NAV_LINKS = [
    { label: 'HOME',        path: '/' },
    { label: 'ARENA',       path: '/event' },
    { label: 'TIMELINE',    path: '/timeline' },
    { label: 'ALLIANCES',   path: '/alliances' },
    { label: 'CREW',        path: '/crew' },
    { label: 'CONNECT HUB', path: '/connect' },
];

const BADGE_MAP = {
    '/timeline': 'MISSION TIMELINE // ACTIVE',
    '/alliances': 'ALLIANCE PORTAL // ACTIVE',
    '/crew': 'PERSONNEL DATA // ACTIVE',
    '/connect': 'COMMUNICATIONS PORTAL // ACTIVE',
    '/event': 'ARENA GRIDS // ACTIVE',
    '/': 'CORE ENGINE // ACTIVE',
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap');
@keyframes common-nav-scan { 0%{background-position:0 0} 100%{background-position:0 4px} }
@keyframes common-nav-glow { 0%,100%{opacity:.75;filter:drop-shadow(0 0 6px #00D9FF)} 50%{opacity:1;filter:drop-shadow(0 0 14px #00D9FF) drop-shadow(0 0 28px #00D9FF)} }
@keyframes common-nav-pulse { 0%,100%{box-shadow:0 0 14px rgba(0,217,255,.3),0 0 28px rgba(0,217,255,.12)} 50%{box-shadow:0 0 26px rgba(0,217,255,.6),0 0 50px rgba(0,217,255,.25)} }

.common-nav-link {
    position: relative;
    font-family: 'Orbitron', monospace;
    font-size: 0.67rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(180, 210, 255, 0.5);
    padding: 10px 18px;
    transition: color 0.25s;
    cursor: pointer;
    text-decoration: none;
}
.common-nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 217, 255, 0.05), rgba(168, 85, 247, 0.05));
    opacity: 0;
    transition: opacity 0.3s;
}
.common-nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 70%;
    height: 2px;
    background: linear-gradient(90deg, #00D9FF, #A855F7);
    border-radius: 2px;
    box-shadow: 0 0 8px #00D9FF, 0 0 16px rgba(168, 85, 247, 0.4);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.common-nav-link:hover {
    color: #fff;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.8), 0 0 22px rgba(0, 217, 255, 0.3);
}
.common-nav-link:hover::before {
    opacity: 1;
}
.common-nav-link:hover::after {
    transform: translateX(-50%) scaleX(1);
}
.common-nav-active {
    color: #00D9FF !important;
    text-shadow: 0 0 10px #00D9FF, 0 0 22px rgba(0, 217, 255, 0.6) !important;
}
.common-nav-active::after {
    transform: translateX(-50%) scaleX(1) !important;
    background: #00D9FF !important;
    box-shadow: 0 0 10px #00D9FF, 0 0 20px rgba(0, 217, 255, 0.6) !important;
}
.common-nav-active .common-c-tl, .common-nav-active .common-c-br {
    opacity: 1 !important;
}
.common-c-tl, .common-c-br {
    position: absolute;
    width: 7px;
    height: 7px;
    opacity: 0;
    transition: opacity 0.3s;
}
.common-c-tl {
    top: 5px;
    left: 10px;
    border-top: 1.5px solid #00D9FF;
    border-left: 1.5px solid #00D9FF;
    box-shadow: -1px -1px 6px rgba(0, 217, 255, 0.5);
}
.common-c-br {
    bottom: 5px;
    right: 10px;
    border-bottom: 1.5px solid #A855F7;
    border-right: 1.5px solid #A855F7;
    box-shadow: 1px 1px 6px rgba(168, 85, 247, 0.5);
}
.common-mob-link {
    position: relative;
    font-family: 'Orbitron', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(180, 210, 255, 0.55);
    padding: 12px 20px;
    border-left: 2.5px solid transparent;
    background: rgba(0, 217, 255, 0.02);
    margin-bottom: 4px;
    transition: all 0.3s;
    cursor: pointer;
    text-decoration: none;
    display: block;
}
.common-mob-link:hover {
    color: #00D9FF;
    background: rgba(0, 217, 255, 0.08);
    border-left: 2.5px solid rgba(0, 217, 255, 0.7);
    text-shadow: 0 0 8px rgba(0, 217, 255, 0.6);
}
.common-mob-active {
    color: #00D9FF !important;
    background: rgba(0, 217, 255, 0.12) !important;
    border-left: 2.5px solid #00D9FF !important;
    text-shadow: 0 0 10px #00D9FF !important;
}
`;

export default function CommonNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const isSidebarOpen = useStore(s => s.isSidebarOpen);
    const setIsSidebarOpen = useStore(s => s.setIsSidebarOpen);
    const go = (path) => { if (path) navigate(path); };

    const activePath = location.pathname.startsWith('/event') ? '/event' : location.pathname;
    const badgeText = BADGE_MAP[activePath] || 'CORE PANEL // ACTIVE';

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <nav style={{ position:'relative', zIndex:20, width:'100%', height:'88px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 clamp(12px,4vw,40px)', pointerEvents:'auto' }}>
                <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'linear-gradient(180deg,rgba(0,217,255,.04) 0%,rgba(2,6,12,.55) 60%,rgba(0,217,255,.025) 100%)', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,217,255,.025) 3px,rgba(0,217,255,.025) 4px)', animation:'common-nav-scan .3s linear infinite' }} />
                
                {/* Logo */}
                <div style={{ display:'flex', alignItems:'center', gap:'12px', fontFamily:'monospace', position:'relative', zIndex:10 }}>
                    <div style={{ position:'relative', animation:'common-nav-glow 2.8s ease-in-out infinite' }}>
                        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" stroke="#00D9FF">
                            <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" />
                            <circle cx="50" cy="50" r="32" strokeWidth="1" />
                            <circle cx="50" cy="50" r="24" strokeWidth="1.5" strokeDasharray="10 5" />
                            <circle cx="50" cy="50" r="14" strokeWidth="1.2" />
                            <path d="M50 14L50 24M50 76L50 86M14 50L24 50M76 50L86 50" strokeWidth="1.5" />
                            <circle cx="50" cy="50" r="4.5" fill="#00D9FF" />
                        </svg>
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,217,255,.1)', borderRadius:'50%', filter:'blur(10px)' }} />
                    </div>
                    <div style={{ display:'flex', flexDirection:'column' }}>
                        <span style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'1.15rem', letterSpacing:'.25em', background:'linear-gradient(90deg,#00D9FF 0%,#a8f0ff 50%,#00D9FF 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 10px rgba(0,217,255,.7))' }}>ADDOVEDI</span>
                        <span style={{ fontSize:'.75rem', fontWeight:900, letterSpacing:'.25em', background:'linear-gradient(90deg,#FF2EA6,#ff85cc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 6px rgba(255,46,166,.6))' }}>2026</span>
                        <div style={{ width:'96px', height:'1px', margin:'2px 0', background:'linear-gradient(90deg,rgba(0,217,255,.4),transparent)' }} />
                        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00D9FF', boxShadow:'0 0 6px #00D9FF', animation:'common-nav-pulse 2s ease-in-out infinite', display:'inline-block' }} />
                            <span style={{ fontSize:'7.5px', color:'#00D9FF', letterSpacing:'.25em', textShadow:'0 0 8px rgba(0,217,255,.7)', fontFamily:'monospace', fontWeight:700 }}>SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex" style={{ alignItems:'center', position:'relative', zIndex:10 }}>
                    {NAV_LINKS.map(({ label, path }) => {
                        const isLinkActive = (path === '/event' && activePath === '/event') || activePath === path;
                        return (
                            <a key={label} href="#" onClick={e => { e.preventDefault(); go(path); }} className={`common-nav-link${isLinkActive ? ' common-nav-active' : ''}`}>
                                <span className="common-c-tl" /><span className="common-c-br" />
                                <span style={{ position:'relative', zIndex: 1 }}>{label}</span>
                            </a>
                        );
                    })}
                </div>

                {/* Desktop Right Badge */}
                <div className="hidden lg:flex" style={{ flexDirection:'column', alignItems:'flex-end', gap:'8px', position:'relative', zIndex:10 }}>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', letterSpacing:'.3em', padding:'4px 12px', border:'1px solid rgba(0,229,255,.25)', borderRadius:'4px', color:'#00E5FF', background:'rgba(0,229,255,.05)', boxShadow:'0 0 8px rgba(0,229,255,.15)' }}>
                        {badgeText}
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <div className="flex lg:hidden" style={{ position:'relative', zIndex:10 }}>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(2,13,26,.85)', border:'1.5px solid rgba(0,217,255,.6)', borderRadius:'50%', boxShadow:'0 0 12px rgba(0,217,255,.45)', cursor:'pointer', position:'relative' }}>
                        <div style={{ position:'absolute', inset:'3px', borderRadius:'50%', border:'1px dashed rgba(0,217,255,.2)', animation:'spin 6s linear infinite' }} />
                        <svg width="20" height="20" stroke="#00D9FF" strokeWidth="2.5" fill="none" viewBox="0 0 24 24">
                            {isSidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </nav>
        </>
    );
}
