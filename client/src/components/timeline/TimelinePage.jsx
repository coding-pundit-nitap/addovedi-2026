/**
 * TimelinePage.jsx — MISSION COMMAND CENTER
 *
 * Three-day mission archive with:
 *  • Steampunk clock rendered as holographic 3D background (cyan wireframe glow)
 *  • Futuristic "save slot" day selectors
 *  • Snake-shaped neon mission route per day
 *  • Right-side HUD panel with event details
 *  • Category-specific holographic node icons
 *  • Boot sequence + holographic day-switch transitions
 *  • Radar / particle / grid animated background
 *  • Fully responsive (desktop + mobile)
 */

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import { DAYS, EVENT_COORDINATORS } from '../../data/events';
import BgCanvas from './BgCanvas';
import MissionNode, { CATEGORY_ICONS } from './MissionNode';
import VerticalTimeline, { getEventStatus } from './VerticalTimeline';
import EventPanel from './EventPanel';

/* ═══════════════════════════════════════════
   DAY SLOT CARD
═══════════════════════════════════════════ */
function DaySlot({ day, isActive, onClick, revealed }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                cursor: 'pointer',
                border: `1px solid ${isActive ? day.color : hov ? day.color + '70' : 'rgba(0,229,255,0.18)'}`,
                borderRadius: '8px',
                padding: '8px 16px',
                background: isActive
                    ? `linear-gradient(135deg, ${day.color}18, ${day.color}08)`
                    : hov ? 'rgba(0,229,255,0.06)' : 'rgba(0,229,255,0.03)',
                boxShadow: isActive ? `0 0 20px ${day.color}35, inset 0 0 20px ${day.color}10` : hov ? `0 0 10px ${day.color}20` : 'none',
                transform: hov || isActive ? 'translateY(-3px)' : 'none',
                transition: 'all 0.25s ease',
                opacity: revealed ? 1 : 0,
                transitionDelay: revealed ? '0.1s' : '0s',
                minWidth: '110px',
                flex: '0 1 auto',
            }}
        >
            <div style={{ fontFamily:"'Orbitron',monospace" }}>
                <div style={{ fontSize:'7px', color: isActive ? day.color : 'rgba(0,229,255,0.3)', letterSpacing:'0.3em', marginBottom:'6px', opacity: isActive ? 0.8 : 0.6 }}>
                    {day.slot}
                </div>
                <div style={{ fontSize:'clamp(12px,2.5vw,18px)', fontWeight:900, color: isActive ? '#FFF' : 'rgba(255,255,255,0.55)', letterSpacing:'0.1em', marginBottom:'5px', textShadow: isActive ? `0 0 12px ${day.color}` : 'none' }}>
                    {day.label}
                </div>
                <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.2em', marginBottom:'6px' }}>
                    {day.date}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: isActive ? day.color : 'rgba(0,229,255,0.3)', boxShadow: isActive ? `0 0 6px ${day.color}` : 'none', animation: isActive ? 'slotPulse 1.5s ease-in-out infinite' : 'none' }} />
                    <span style={{ fontSize:'7px', color: isActive ? day.color : 'rgba(0,229,255,0.4)', letterSpacing:'0.2em' }}>
                        {day.events.length} EVENTS
                    </span>
                </div>
            </div>
        </div>
    );
}


/* ═══════════════════════════════════════════
   MOBILE: VERTICAL NODE LIST
═══════════════════════════════════════════ */
function MobileNodeList({ events, selectedId, onSelect, revealed, dayColor, now24 }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0', paddingBottom:'8px' }}>
            {events.map((ev, i) => {
                const catInfo = CATEGORY_ICONS[ev.category] || { icon:'◆', color:'#00E5FF' };
                const isSelected = selectedId === ev.id;
                const isLeft = i % 2 === 0;
                return (
                    <div key={ev.id} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'scale(0.8)', transition:`opacity 0.4s ${i * 0.07}s, transform 0.5s ${i * 0.07}s` }}>
                        <div style={{ display:'flex', alignItems:'center', width:'100%', gap:'0', flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                            {/* Card */}
                            <div
                                onClick={() => onSelect(ev)}
                                style={{
                                    flex:1,
                                    background: isSelected ? `linear-gradient(135deg,${catInfo.color}18,${catInfo.color}08)` : 'rgba(6,8,15,0.85)',
                                    border:`1px solid ${isSelected ? catInfo.color + '80' : 'rgba(0,229,255,0.15)'}`,
                                    borderRadius:'8px',
                                    padding:'10px 12px',
                                    cursor:'pointer',
                                    boxShadow: isSelected ? `0 0 14px ${catInfo.color}25` : 'none',
                                    transition:'all 0.25s',
                                    fontFamily:"'Orbitron',monospace",
                                }}
                            >
                                <div style={{ fontSize:'7px', color: catInfo.color, letterSpacing:'0.25em', marginBottom:'3px', opacity:0.65 }}>
                                    {ev.time} // {ev.category.toUpperCase()}
                                </div>
                                <div style={{ fontSize:'11px', fontWeight:900, color:'#FFF', letterSpacing:'0.06em', marginBottom:'2px' }}>
                                    {catInfo.icon} {ev.title}
                                </div>
                                <div style={{ fontSize:'7px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em' }}>
                                    {ev.subtitle}
                                </div>
                            </div>

                            {/* Arm to node */}
                            <div style={{ width:'20px', height:'2px', background:`linear-gradient(${isLeft?'90deg':'270deg'},transparent,${catInfo.color}60)`, flexShrink:0 }} />

                            {/* Node dot */}
                            <div style={{
                                width:'28px', height:'28px', borderRadius:'50%',
                                border:`2px solid ${catInfo.color}`,
                                background:`radial-gradient(circle,${catInfo.color}25,transparent)`,
                                boxShadow: isSelected ? `0 0 14px ${catInfo.color}` : `0 0 5px ${catInfo.color}50`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'12px', flexShrink:0,
                                animation:'nodePulse 2s ease-in-out infinite',
                            }}>
                                {catInfo.icon}
                            </div>
                        </div>

                        {/* Vertical connector */}
                        {i < events.length - 1 && (
                            <div style={{ width:'2px', height:'24px', background:`linear-gradient(to bottom,${catInfo.color}50,rgba(0,229,255,0.15))`, boxShadow:`0 0 4px ${catInfo.color}30`, borderRadius:'1px', marginLeft: isLeft ? 'auto' : undefined, marginRight: !isLeft ? 'auto' : undefined, marginInline: '14px' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function TimelinePage() {
    const navigate = useNavigate();
    const [booted, setBooted] = useState(false);
    const [activeDay, setActiveDay] = useState(0);
    const [selectedEv, setSelectedEv] = useState(null);
    const [transitioning, setTransitioning] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [scrollProgress, setScrollProgress] = useState(0);
    const timelineRef = useRef(null);

    const now24 = useMemo(() => {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
    }, []);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleScroll = () => {
        const el = timelineRef.current;
        if (!el) return;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const progress = maxScroll > 0 ? Math.min(Math.max(el.scrollTop / maxScroll, 0), 1) : 0;
        setScrollProgress(progress);
    };

    useEffect(() => {
        handleScroll();
    }, [booted, activeDay]);

    const handleBoot = useCallback(() => {
        setBooted(true);
        setTimeout(() => setContentVisible(true), 200);
    }, []);

    const switchDay = useCallback((idx) => {
        if (idx === activeDay || transitioning) return;
        setTransitioning(true);
        setContentVisible(false);
        setSelectedEv(null);
        setTimeout(() => {
            setActiveDay(idx);
            setTransitioning(false);
            setTimeout(() => setContentVisible(true), 50);
        }, 350);
    }, [activeDay, transitioning]);

    const day = DAYS[activeDay];

    return (
        <div
            ref={timelineRef}
            onScroll={handleScroll}
            className="timeline-scroll-container"
            style={{ position:'fixed', inset:0, background:'#06080F', zIndex:100, overflowY:'auto', overflowX:'hidden' }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes nodePulse { 0%,100%{opacity:0.9}50%{opacity:1;box-shadow:0 0 18px currentColor} }
                @keyframes slotPulse { 0%,100%{opacity:0.8}50%{opacity:1;transform:scale(1.3)} }
                @keyframes rippleOut { 0%{transform:scale(1);opacity:0.7}100%{transform:scale(2.5);opacity:0} }
                @keyframes railParticle {
                    0%{transform:translate(-50%,-50%) translateX(-6px);opacity:0}
                    50%{opacity:0.9}
                    100%{transform:translate(-50%,-50%) translateX(6px);opacity:0}
                }
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes strokeMove {
                    to {
                        stroke-dashoffset: -20;
                    }
                }

                .timeline-track-card-wrap {
                    position: relative;
                    clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
                    background: var(--btn-border-color, rgba(0, 229, 255, 0.15));
                    padding: 1.5px;
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
                }
                .timeline-track-card-inner {
                    clip-path: polygon(11.2px 0, 100% 0, 100% calc(100% - 11.2px), calc(100% - 11.2px) 100%, 0 100%, 0 11.2px);
                    background: rgba(6, 10, 22, 0.85);
                    backdrop-filter: blur(12px);
                    padding: 14px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    transition: background 0.3s ease;
                }

                .timeline-scroll-container {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .timeline-scroll-container::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }

                .scroll-indicator-track {
                    position: fixed;
                    right: 16px;
                    top: 96px;
                    bottom: 24px;
                    width: 4px;
                    background: rgba(0, 217, 255, 0.08);
                    border-radius: 999px;
                    box-shadow: inset 0 0 6px rgba(0, 217, 255, 0.08);
                    z-index: 40;
                    overflow: hidden;
                }
                .scroll-indicator-track::before {
                    content: '';
                    position: absolute;
                    inset: 12px 0;
                    background: linear-gradient(180deg, rgba(0, 217, 255, 0.1) 0%, transparent 40%, transparent 60%, rgba(0, 217, 255, 0.1) 100%);
                    opacity: 0.8;
                }
                .scroll-indicator-thumb {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 36px;
                    border-radius: 999px;
                    background: linear-gradient(180deg, #00E5FF, #FF2CFB);
                    box-shadow: 0 0 12px rgba(0, 229, 255, 0.6), 0 0 24px rgba(255, 44, 251, 0.4);
                    cursor: pointer;
                    transition: opacity 0.2s, height 0.2s;
                }
                .scroll-indicator-thumb:hover {
                    height: 46px;
                    box-shadow: 0 0 16px rgba(0, 229, 255, 0.8), 0 0 32px rgba(255, 44, 251, 0.6);
                }
            `}</style>

            <div className="scroll-indicator-track">
                <div
                    className="scroll-indicator-thumb"
                    style={{ top: `calc(${scrollProgress * 100}% )` }}
                />
            </div>

            <BgCanvas />
            {!booted && <CommonLoader onDone={handleBoot} pageName="Timeline" />}

            <div style={{ position:'relative', zIndex:20 }}>
                <CommonNav />
            </div>

            <div style={{
                position:'relative', zIndex:10,
                minHeight:'calc(100vh - 88px)',
                padding: isMobile ? '88px 14px 40px' : '88px 40px 50px',
                opacity: contentVisible ? 1 : 0,
                transition:'opacity 0.4s ease',
                display:'flex',
                flexDirection:'column',
                gap: isMobile ? '20px' : '28px',
            }}>

                {/* ── System Status Bar ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', flexWrap:'wrap', gap:'10px' }}>
                    <div style={{
                        display:'flex', alignItems:'center', gap:'20px',
                        fontFamily:"'Orbitron',monospace", fontSize:'7px', letterSpacing:'0.3em',
                        color:'rgba(0,229,255,0.45)',
                        border:'1px solid rgba(0,229,255,0.1)', borderRadius:'6px',
                        padding:'6px 16px', background:'rgba(0,229,255,0.03)',
                    }}>
                        <span>SYSTEM STATUS</span>
                        <span style={{ color: day.color, textShadow:`0 0 6px ${day.color}` }}>{day.label}</span>
                        <span style={{ color:'rgba(0,229,255,0.35)' }}>{day.events.length} EVENTS</span>
                        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                            <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#1FFF76', animation:'slotPulse 1.5s ease-in-out infinite', boxShadow:'0 0 5px #1FFF76' }} />
                            <span style={{ color:'#1FFF76' }}>ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* ── Title ── */}
                <div style={{ textAlign:'center' }}>
                    <div style={{
                        fontFamily:"'Orbitron',monospace",
                        fontSize:'clamp(24px,5.5vw,58px)', fontWeight:900,
                        letterSpacing:'clamp(0.08em,1.5vw,0.35em)',
                        color:'#FFF',
                        textShadow:'0 0 28px rgba(0,229,255,0.55), 0 0 55px rgba(0,229,255,0.18)',
                        lineHeight:1, marginBottom:'10px',
                    }}>
                        MISSION CONTROL
                    </div>
                    <div style={{
                        fontFamily:"'Orbitron',monospace",
                        fontSize:'clamp(7px,1.4vw,11px)', letterSpacing:'clamp(0.3em,1vw,0.6em)',
                        color:'rgba(0,229,255,0.45)', marginBottom:'14px',
                    }}>
                        SELECT MISSION DAY → CHOOSE NODE → VIEW BRIEFING
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                        <div style={{ height:'1px', width:'clamp(40px,8vw,100px)', background:'linear-gradient(90deg,transparent,rgba(0,229,255,0.4))' }} />
                        <div style={{ color:'rgba(0,229,255,0.3)', fontSize:'10px' }}>◆</div>
                        <div style={{ height:'1px', width:'clamp(40px,8vw,100px)', background:'linear-gradient(270deg,transparent,rgba(0,229,255,0.4))' }} />
                    </div>
                </div>

                {/* ── Day Slot Selectors ── */}
                <div style={{ display:'flex', gap:'clamp(10px,2vw,20px)', justifyContent:'center', flexWrap:'wrap' }}>
                    {DAYS.map((d, i) => (
                        <DaySlot key={d.slot} day={d} isActive={i === activeDay} onClick={() => switchDay(i)} revealed={contentVisible} />
                    ))}
                </div>

                {/* ── Main Content: Desktop (Snake + Right Panel) / Mobile (list + bottom) ── */}
                {!isMobile ? (
                    <div style={{ display:'flex', gap:'28px', alignItems:'flex-start' }}>
                        {/* Left Column: Legend Deck */}
                        <div style={{
                            width: '160px',
                            flexShrink: 0,
                            position: 'sticky',
                            top: '108px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '16px',
                            background: 'rgba(0,229,255,0.02)',
                            borderRadius: '10px',
                            border: '1px solid rgba(0,229,255,0.07)',
                            backdropFilter: 'blur(8px)',
                            opacity: contentVisible ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                        }}>
                            <div style={{
                                fontFamily: "'Orbitron', monospace",
                                fontSize: '8px',
                                color: 'rgba(0,229,255,0.4)',
                                letterSpacing: '0.25em',
                                borderBottom: '1px solid rgba(0,229,255,0.1)',
                                paddingBottom: '8px',
                                marginBottom: '4px'
                            }}>
                                LEGEND DECK
                            </div>
                            {Object.entries(CATEGORY_ICONS).map(([cat, { icon, color }]) => (
                                <div key={cat} style={{ display:'flex', alignItems:'center', gap:'10px', padding: '4px 0' }}>
                                    <span style={{ fontSize:'16px', filter: `drop-shadow(0 0 4px ${color}50)`, color: color }}>{icon}</span>
                                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize: '9px', color: 'rgba(255,255,255,0.6)', letterSpacing:'0.12em', fontWeight: 600 }}>
                                        {cat.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Center Column: Vertical Timeline */}
                        <div style={{
                            flex:1,
                            background:'rgba(0,229,255,0.02)',
                            border:'1px solid rgba(0,229,255,0.08)',
                            borderRadius:'12px',
                            padding:'28px 18px',
                            backdropFilter:'blur(8px)',
                            opacity: transitioning ? 0.3 : 1,
                            transform: transitioning ? 'scale(0.98)' : 'scale(1)',
                            transition:'opacity 0.35s, transform 0.35s',
                        }}>
                            {/* Day heading inside map */}
                            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px', padding: '0 10px' }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:900, color: day.color, letterSpacing:'0.2em', textShadow:`0 0 10px ${day.color}` }}>
                                    {day.label} — {day.date}
                                </div>
                                <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${day.color}50, transparent)` }} />
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.2em' }}>
                                    CHRONOLOGICAL SCHEDULE
                                </div>
                            </div>
                            <VerticalTimeline
                                events={day.events}
                                selectedId={selectedEv?.id}
                                onSelect={setSelectedEv}
                                revealed={contentVisible && !transitioning}
                                dayColor={day.color}
                                now24={now24}
                            />
                        </div>

                        {/* Right HUD Panel */}
                        <div style={{ width:'260px', flexShrink:0, position:'sticky', top:'108px' }}>
                            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', color:'rgba(0,229,255,0.35)', letterSpacing:'0.3em', marginBottom:'10px' }}>
                                MISSION BRIEFING
                            </div>
                            <EventPanel ev={selectedEv} dayColor={day.color} visible={!!selectedEv && !transitioning} />
                        </div>
                    </div>
                ) : (
                    /* ── MOBILE LAYOUT ── */
                    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                        {/* Mobile snake (vertical) */}
                        <div style={{
                            background:'rgba(0,229,255,0.02)', border:'1px solid rgba(0,229,255,0.08)',
                            borderRadius:'10px', padding:'16px',
                            opacity: transitioning ? 0.3 : 1, transition:'opacity 0.3s',
                        }}>
                            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color: day.color, letterSpacing:'0.2em', marginBottom:'16px', textShadow:`0 0 8px ${day.color}` }}>
                                {day.label} — MISSION ROUTE
                            </div>
                            <MobileNodeList
                                events={day.events}
                                selectedId={selectedEv?.id}
                                onSelect={setSelectedEv}
                                revealed={contentVisible && !transitioning}
                                dayColor={day.color}
                                now24={now24}
                            />
                        </div>

                        {/* Mobile detail panel (Modal Popup) */}
                        <AnimatePresence>
                            {selectedEv && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedEv(null)}
                                    style={{
                                        position: 'fixed',
                                        inset: 0,
                                        zIndex: 1000,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '16px',
                                        background: 'rgba(0, 0, 0, 0.8)',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0.92, y: 15 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.92, y: 15 }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            width: '100%',
                                            maxWidth: '380px',
                                            position: 'relative'
                                        }}
                                    >
                                        <EventPanel 
                                            ev={selectedEv} 
                                            dayColor={day.color} 
                                            visible={true} 
                                            onClose={() => setSelectedEv(null)} 
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* ── Category Legend (Mobile only at the bottom) ── */}
                {isMobile && (
                    <div style={{
                        display:'flex', gap:'clamp(10px,2vw,18px)', flexWrap:'wrap', justifyContent:'center',
                        padding:'14px', background:'rgba(0,229,255,0.02)', borderRadius:'8px',
                        border:'1px solid rgba(0,229,255,0.07)',
                        opacity: contentVisible ? 1 : 0, transition:'opacity 0.5s ease 1s',
                    }}>
                        {Object.entries(CATEGORY_ICONS).map(([cat, { icon, color }]) => (
                            <div key={cat} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                                <span style={{ fontSize:'12px' }}>{icon}</span>
                                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.15em' }}>
                                    {cat.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
