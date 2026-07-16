/**
 * CrewNav.jsx — Navbar for /crew, CREW link highlighted as active.
 * Mirrors the site-wide navbar style (Orbitron, scanline, corner brackets).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
    { label: 'HOME',        path: '/home' },
    { label: 'ARENA',       path: '/event' },
    { label: 'TIMELINE',    path: '/timeline' },
    { label: 'ALLIANCES',   path: '/alliances' },
    { label: 'CREW',        path: '/crew' },
    { label: 'CONNECT HUB', path: '/connect' },
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap');
@keyframes cr-scan { 0%{background-position:0 0} 100%{background-position:0 4px} }
@keyframes cr-glow { 0%,100%{opacity:.75;filter:drop-shadow(0 0 6px #00D9FF)} 50%{opacity:1;filter:drop-shadow(0 0 14px #00D9FF) drop-shadow(0 0 28px #00D9FF)} }
@keyframes cr-pulse { 0%,100%{box-shadow:0 0 14px rgba(0,217,255,.3),0 0 28px rgba(0,217,255,.12)} 50%{box-shadow:0 0 26px rgba(0,217,255,.6),0 0 50px rgba(0,217,255,.25)} }
.cr-nav-link{position:relative;font-family:'Orbitron',monospace;font-size:.67rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:rgba(180,210,255,.5);padding:10px 18px;transition:color .25s;cursor:pointer;text-decoration:none}
.cr-nav-link::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,217,255,.05),rgba(168,85,247,.05));opacity:0;transition:opacity .3s}
.cr-nav-link::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%) scaleX(0);width:70%;height:2px;background:linear-gradient(90deg,#00D9FF,#A855F7);border-radius:2px;box-shadow:0 0 8px #00D9FF,0 0 16px rgba(168,85,247,.4);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.cr-nav-link:hover{color:#fff;text-shadow:0 0 10px rgba(0,217,255,.8),0 0 22px rgba(0,217,255,.3)}
.cr-nav-link:hover::before{opacity:1}
.cr-nav-link:hover::after{transform:translateX(-50%) scaleX(1)}
.cr-nav-active{color:#00D9FF!important;text-shadow:0 0 10px #00D9FF,0 0 22px rgba(0,217,255,.6)!important}
.cr-nav-active::after{transform:translateX(-50%) scaleX(1)!important;background:#00D9FF!important;box-shadow:0 0 10px #00D9FF,0 0 20px rgba(0,217,255,.6)!important}
.cr-nav-active .cr-c-tl,.cr-nav-active .cr-c-br{opacity:1!important}
.cr-c-tl,.cr-c-br{position:absolute;width:7px;height:7px;opacity:0;transition:opacity .3s}
.cr-c-tl{top:5px;left:10px;border-top:1.5px solid #00D9FF;border-left:1.5px solid #00D9FF;box-shadow:-1px -1px 6px rgba(0,217,255,.5)}
.cr-c-br{bottom:5px;right:10px;border-bottom:1.5px solid #A855F7;border-right:1.5px solid #A855F7;box-shadow:1px 1px 6px rgba(168,85,247,.5)}
.cr-mob-link{position:relative;font-family:'Orbitron',monospace;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:rgba(180,210,255,.55);padding:12px 20px;border-left:2.5px solid transparent;background:rgba(0,217,255,.02);margin-bottom:4px;transition:all .3s;cursor:pointer;text-decoration:none;display:block}
.cr-mob-link:hover{color:#00D9FF;background:rgba(0,217,255,.08);border-left:2.5px solid rgba(0,217,255,.7);text-shadow:0 0 8px rgba(0,217,255,.6)}
.cr-mob-active{color:#00D9FF!important;background:rgba(0,217,255,.12)!important;border-left:2.5px solid #00D9FF!important;text-shadow:0 0 10px #00D9FF!important}
`;

export default function CrewNav() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const go = (path) => { setOpen(false); if (path) navigate(path); };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <nav style={{ position:'relative', zIndex:20, width:'100%', height:'88px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 clamp(12px,4vw,40px)', pointerEvents:'auto' }}>
                <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'linear-gradient(180deg,rgba(0,217,255,.04) 0%,rgba(2,6,12,.55) 60%,rgba(0,217,255,.025) 100%)', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,217,255,.025) 3px,rgba(0,217,255,.025) 4px)', animation:'cr-scan .3s linear infinite' }} />
                {/* Logo */}
                <div style={{ display:'flex', alignItems:'center', gap:'12px', fontFamily:'monospace', position:'relative', zIndex:10 }}>
                    <div style={{ position:'relative', animation:'cr-glow 2.8s ease-in-out infinite' }}>
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
                            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00D9FF', boxShadow:'0 0 6px #00D9FF', animation:'cr-pulse 2s ease-in-out infinite', display:'inline-block' }} />
                            <span style={{ fontSize:'7.5px', color:'#00D9FF', letterSpacing:'.25em', textShadow:'0 0 8px rgba(0,217,255,.7)', fontFamily:'monospace', fontWeight:700 }}>SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>
                {/* Desktop links */}
                <div className="hidden lg:flex" style={{ alignItems:'center', position:'relative', zIndex:10 }}>
                    {NAV_LINKS.map(({ label, path }) => (
                        <a key={label} href="#" onClick={e => { e.preventDefault(); go(path); }} className={`cr-nav-link${label === 'CREW' ? ' cr-nav-active' : ''}`}>
                            <span className="cr-c-tl" /><span className="cr-c-br" />
                            <span style={{ position:'relative', zIndex:1 }}>{label}</span>
                        </a>
                    ))}
                </div>
                {/* Desktop right badge */}
                <div className="hidden lg:flex" style={{ flexDirection:'column', alignItems:'flex-end', gap:'8px', position:'relative', zIndex:10 }}>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', letterSpacing:'.3em', padding:'4px 12px', border:'1px solid rgba(0,229,255,.25)', borderRadius:'4px', color:'#00E5FF', background:'rgba(0,229,255,.05)', boxShadow:'0 0 8px rgba(0,229,255,.15)' }}>
                        PERSONNEL DATABASE // ACTIVE
                    </div>
                </div>
                {/* Mobile hamburger */}
                <div className="flex lg:hidden" style={{ position:'relative', zIndex:10 }}>
                    <button onClick={() => setOpen(v => !v)} style={{ width:'48px', height:'48px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(2,13,26,.85)', border:'1.5px solid rgba(0,217,255,.6)', borderRadius:'50%', boxShadow:'0 0 12px rgba(0,217,255,.45)', cursor:'pointer', position:'relative' }}>
                        <div style={{ position:'absolute', inset:'3px', borderRadius:'50%', border:'1px dashed rgba(0,217,255,.2)', animation:'spin 6s linear infinite' }} />
                        <svg width="20" height="20" stroke="#00D9FF" strokeWidth="2.5" fill="none" viewBox="0 0 24 24">
                            {open ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div key="cr-bd" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:40 }} className="lg:hidden" />
                        <motion.div key="cr-dr" initial={{ x:'100%', opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:'100%', opacity:0 }} transition={{ type:'spring', damping:28, stiffness:220 }} className="lg:hidden" style={{ position:'fixed', top:'96px', right:'16px', bottom:'80px', width:'290px', zIndex:50, display:'flex', flexDirection:'column', padding:'24px', gap:'24px', background:'#000', border:'1.5px solid rgba(0,217,255,.5)', backdropFilter:'blur(16px)', clipPath:'polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px)', boxShadow:'0 0 30px rgba(0,217,255,.25)', overflowY:'auto' }}>
                            <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:.15, backgroundImage:'linear-gradient(rgba(0,217,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,217,255,.2) 1px,transparent 1px)', backgroundSize:'16px 16px' }} />
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(0,240,255,.15)', paddingBottom:'16px', position:'relative', zIndex:10 }}>
                                <span style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'.82rem', letterSpacing:'.25em', color:'#00D9FF', textShadow:'0 0 10px rgba(0,217,255,.7)' }}>NAVIGATION MENU</span>
                                <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.5)', fontSize:'13px' }}>✕</button>
                            </div>
                            <div style={{ display:'flex', flexDirection:'column', position:'relative', zIndex:10 }}>
                                {NAV_LINKS.map(({ label, path }) => (
                                    <a key={label} href="#" onClick={e => { e.preventDefault(); go(path); }} className={`cr-mob-link${label === 'CREW' ? ' cr-mob-active' : ''}`}>
                                        {label}
                                    </a>
                                ))}
                            </div>
                            <div style={{ marginTop:'auto', borderTop:'1px solid rgba(0,240,255,.15)', paddingTop:'16px', position:'relative', zIndex:10 }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', letterSpacing:'.25em', padding:'8px 14px', border:'1px solid rgba(0,229,255,.2)', borderRadius:'4px', color:'#00E5FF', background:'rgba(0,229,255,.05)', textAlign:'center' }}>
                                    PERSONNEL DATABASE // ACTIVE
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
